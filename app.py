import os
import re
from werkzeug.utils import secure_filename
from flask_wtf import FlaskForm
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Column, Integer, Float, desc, asc, text, TIMESTAMP
from werkzeug.security import generate_password_hash, check_password_hash
from wtforms.validators import DataRequired, Length, EqualTo
from flask import Flask, render_template, redirect, request, url_for, flash, jsonify
from wtforms import StringField, SubmitField, PasswordField, BooleanField
from flask_login import LoginManager, UserMixin, current_user, login_user, logout_user, login_required
from datetime import datetime

app = Flask(__name__)


# 配置数据库
class Config(object):
    SECRET_KEY = 'flask_login'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(app.root_path, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False


app.config.from_object(Config)
mysql = SQLAlchemy(app)
login_manager = LoginManager(app)


# 创建登录表单类
class LoginForm(FlaskForm):
    username = StringField(label='用户名', validators=[DataRequired()])
    password = PasswordField(label='密码', validators=[DataRequired()])
    remember_me = BooleanField(label='记住我')
    submit = SubmitField(label='登录')


# 注册表单
class RegisgerForm(FlaskForm):
    username = StringField(label='用户名', validators=[DataRequired()])
    password = PasswordField(label='设置密码', validators=[DataRequired(), Length(min=6, max=10)])
    confirm_password = PasswordField(label='确认密码', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField(label='注册')


class ResetForm(FlaskForm):
    username = StringField(label='用户名', validators=[DataRequired()])
    old_password = PasswordField(label='输入旧密码', validators=[DataRequired()])
    new_password = PasswordField(label='设置新密码', validators=[DataRequired(), Length(min=6, max=10)])
    confirm_password = PasswordField(label='确认密码',
                                     validators=[DataRequired(), EqualTo('new_password')])
    submit = SubmitField(label='重置密码')


class User(mysql.Model, UserMixin):
    # 定义表名
    __tablename__ = 'tab_user'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(128), index=True, unique=True)
    password_hash = Column(String(128))
    authority = Column(String(128))
    shopping_cart = Column(String(10000))

    # #将密码经过哈希处理，使用密文形式
    def set_password(self):
        self.password_hash = generate_password_hash(self.password_hash)

    # 验证密码是否正确
    # Returns `True` if the password matched, `False` otherwise.
    def validate_password(self, password):
        return check_password_hash(self.password_hash, password)


class Product(mysql.Model):
    # 定义表名
    __tablename__ = 'product_form'
    product_id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(30), index=True, unique=True)
    product_tag = Column(String(50))
    product_describe = Column(String(100), default='default_description')
    product_cost = Column(Float, default=0)
    suggested_price = Column(Float)
    product_repertory = Column(Integer, default=0)
    product_hits = Column(Integer, default=0)
    product_image = Column(String(255))
    sold_out = Column(Integer, default=0)


class Import(mysql.Model):
    # 定义表名
    __tablename__ = 'import_form'
    import_id = Column(Integer, primary_key=True, unique=True)
    import_product_id = Column(Integer, index=True)
    import_number = Column(Integer, default=0)
    import_price = Column(Float, default=0)
    is_arrival = Column(Integer, default=0)


class Ex(mysql.Model):
    # 定义表名
    __tablename__ = 'ex_pro'
    export_id = Column(Integer, primary_key=True)
    product_name = Column(String(200), primary_key=True)
    number = Column(Integer)
    price = Column(String(200))


class Export(mysql.Model):
    # 定义表名
    __tablename__ = 'export_form'
    export_id = Column(Integer, primary_key=True)
    export_user_id = Column(Integer)
    export_employee_id = Column(Integer)
    export_describe = Column(String(15000))
    export_deal = Column(Integer, default=0)
    export_remark = Column(String(200))


class Logs(mysql.Model):
    # 定义表名
    __tablename__ = 'logs'
    log_id = Column(Integer, primary_key=True)
    log_userid = Column(Integer)
    log_details = Column(String(200))
    log_time = Column(TIMESTAMP, default=datetime.now)


# 这个回调用于从会话中存储的用户 ID 重新加载用户对象
@login_manager.user_loader
def load_user(user_id):
    user = User.query.get(int(user_id))
    return user


# 默认情况下，当未登录的用户尝试访问一个 login_required 装饰的视图，
# Flask-Login 会闪现一条消息并且重定向到登录视图。(如果未设置登录视图，它将会以 401 错误退出。)
login_manager.login_view = 'login'


@app.route('/', methods=['POST', 'GET'])
def index():
    if current_user.is_authenticated:
        username = current_user.username
        return render_template('index.html', username=username)
    else:
        return render_template('index.html')


@app.route('/products', methods=['POST', 'GET'])
def products():
    if current_user.is_authenticated:
        username = current_user.username
        return render_template('shop-grid.html', username=username)
    else:
        return render_template('shop-grid.html')


@app.route('/checkout', methods=['POST', 'GET'])
def checkout():
    if current_user.is_authenticated:
        username = current_user.username
        return render_template('checkout.html', username=username)
    else:
        return render_template('checkout.html')


@app.route('/orderlist', methods=['POST', 'GET'])
def orderlist():
    if current_user.is_authenticated:
        username = current_user.username
        return render_template('orderlist.html', username=username)
    else:
        return render_template('orderlist.html')


@app.route('/order_list')
def order_list():
    if current_user.is_authenticated:
        username = current_user.username
        user = User.query.filter_by(username=username).first()
        e_list = Export.query.filter_by(export_user_id=user.id).order_by(desc(Export.export_id)).all()
        exports_list = [
            [
                ex.export_id,
                User.query.get(int(ex.export_user_id)).username,
                User.query.get(int(ex.export_employee_id)).username if ex.export_employee_id else None,
                ex.export_describe,
                ex.export_deal,
                ex.export_remark
            ]
            for ex in e_list
        ]
        return jsonify(exports_list)


@app.route('/product-details', methods=['POST', 'GET'])
def product_details():
    pname = request.args.get('pname')
    if pname:
        if current_user.is_authenticated:
            username = current_user.username
            return render_template('product-details.html', pname=pname, username=username)
        else:
            return render_template('product-details.html', pname=pname)


@app.route('/login', methods=['POST', 'GET'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if request.method == 'POST':
        if form.validate_on_submit():
            username = form.username.data
            password = form.password.data
            remember = form.remember_me.data
            # 数据库查询
            user = User.query.filter_by(username=username).first()
            if user:
                if username == user.username and user.validate_password(password):
                    # if username==username:
                    # login_user表示让用户登录。保存到当前会话当中（session），这样才能加载和访问id
                    login_user(user, remember)

                    new_log = Logs(log_userid=user.id, log_details="登录")
                    mysql.session.add(new_log)
                    mysql.session.commit()
                    if user.authority != "customer":
                        return redirect(url_for('edit_product'))
                    else:
                        return redirect(url_for('index', username=username))
                else:
                    flash('账户名或者密码错误')
                    redirect(url_for('login'))
            else:
                flash('账户名不存在')
                redirect(url_for('login'))
    return render_template('login.html', form=form)


@app.route('/boss', methods=['POST', 'GET'])
@login_required
def boss():
    if current_user.authority == 'boss':
        return render_template('boss.html')
    else:
        return redirect(url_for('login'))


@app.route('/edituser', methods=['POST', 'GET'])
def edituser():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        authority = request.form.get('authority_list')
        form_type = request.form.get('form_type')
        print(username, password, authority, form_type)
        if form_type == 'user-edit':
            user = mysql.session.query(User).filter_by(username=username).first()
            if username == user.username:
                if password:
                    user.password_hash = password
                    user.set_password()
                user.authority = authority
                mysql.session.commit()
                mysql.session.close()
        elif form_type == 'user-add':
            user = mysql.session.query(User).filter_by(username=username).first()
            if user:
                flash('该用户已经存在')
                return redirect(url_for('boss'))
            else:
                new_user = User(username=username, password_hash=password, authority=authority)
                new_user.set_password()
                mysql.session.add(new_user)
                mysql.session.commit()
                mysql.session.close()
        return redirect(url_for('boss'))


@app.route('/delete_user', methods=['POST', 'GET'])
def delete_user():
    if request.method == 'POST':
        username = request.form.get('username')
        user = mysql.session.query(User).filter_by(username=username).first()
        if user:
            mysql.session.delete(user)
            mysql.session.commit()
            mysql.session.close()
    return redirect(url_for('boss'))


@app.route('/off_product', methods=['POST', 'GET'])
def off_product():
    if request.method == 'POST':
        pname = request.form.get('pname')
        product = mysql.session.query(Product).filter_by(product_name=pname).first()
        if product:
            product.sold_out = 1 - product.sold_out
            mysql.session.commit()
            mysql.session.close()
    return redirect(url_for('edit_product'))


@app.route('/delete_product', methods=['POST', 'GET'])
def delete_product():
    if request.method == 'POST':
        pname = request.form.get('pname')
        product = mysql.session.query(Product).filter_by(product_name=pname).first()
        if product:
            mysql.session.delete(product)
            mysql.session.commit()
            mysql.session.close()
    return redirect(url_for('edit_product'))


@app.route('/editproduct', methods=['POST', 'GET'])
@login_required
def edit_product():
    if current_user.authority != 'customer':
        return render_template('product-edit.html')
    else:
        return redirect(url_for('login'))


@app.route('/goods_import', methods=['POST', 'GET'])
@login_required
def goods_import():
    if current_user.authority != 'customer':
        return render_template('goods-import.html')
    else:
        return redirect(url_for('login'))


@app.route('/goods_export', methods=['POST', 'GET'])
@login_required
def goods_export():
    if current_user.authority != 'customer':
        return render_template('goods-export.html')
    else:
        return redirect(url_for('login'))


@app.route('/logs', methods=['POST', 'GET'])
@login_required
def logs():
    if current_user.authority == 'boss':
        return render_template('logs.html')
    else:
        return redirect(url_for('login'))


@app.route('/export_details', methods=['POST', 'GET'])
@login_required
def export_details():
    if current_user.authority != 'customer':
        eid = request.args.get('eid')
        cname = request.args.get('cname')
        ename = request.args.get('ename')
        details = request.args.get('details')
        remark = request.args.get('remark')
        sh = request.args.get('sh')
        # 在这里处理 pname 参数的逻辑
        return render_template('export-details.html', eid=eid, cname=cname, ename=ename,
                               details=details, remark=remark, sh=sh)
    else:
        return redirect(url_for('login'))


@app.route('/editproducts', methods=['POST', 'GET'])
def edit_products():
    if request.method == 'POST':
        productname = request.form.get('productname')
        productname = productname.upper()
        tag = request.form.get('tag')
        suggest = request.form.get('suggest')
        describe = request.form.get('describe')
        file_obj = request.files.get('imageInput')
        if file_obj:
            filename = secure_filename(file_obj.filename)
            file_path = 'static/uploads/' + filename
            file_obj.save(file_path)
        else:
            file_path = request.form.get('imageLink')
        form_type = request.form.get('form_type')
        if form_type == 'product-add':
            product_data = Product.query.filter_by(product_name=productname).first()
            if product_data:
                flash('该产品已经存在')
                return redirect(url_for('edit_product'))
            new_product = Product(product_name=productname, product_tag=tag, suggested_price=suggest,
                                  product_describe=describe, product_image=file_path)
            mysql.session.add(new_product)
        elif form_type == 'product-edit':
            product_data = Product.query.filter_by(product_name=productname).first()
            if product_data.product_name == productname:
                product_data.product_tag = tag
                product_data.suggested_price = suggest
                product_data.product_describe = describe
                product_data.product_image = file_path
        mysql.session.commit()
        mysql.session.close()
        return redirect(url_for('edit_product'))


@app.route('/logout', methods=['POST', 'GET'])
def logout():
    # Logs a user out. (You do not need to pass the actual user.)
    # This will also clean up the remember me cookie if it exists.
    username = current_user.username
    user = User.query.filter_by(username=username).first()
    new_log = Logs(log_userid=user.id, log_details="登出")
    mysql.session.add(new_log)
    mysql.session.commit()
    logout_user()
    return redirect(request.referrer)


# 实现注册
@app.route('/register', methods=['POST', 'GET'])
def register():
    registerform = RegisgerForm()
    if request.method == 'POST':
        if registerform.validate_on_submit():
            username = registerform.username.data
            password = registerform.password.data
            confirm_password = registerform.confirm_password.data
            if password != confirm_password:
                flash('确认密码必须和设置密码一致')
                return render_template('register.html', registerform=registerform)
            user_data = User.query.filter_by(username=username).first()
            if user_data:
                flash('该用户已经存在')
                return render_template('register.html', registerform=registerform)
            else:
                new_user = User(username=username, password_hash=password, authority='customer')
                new_user.set_password()
                mysql.session.add(new_user)
                mysql.session.commit()
                mysql.session.close()
                flash('注册成功')
                return redirect(url_for('login'))
    return render_template('register.html', registerform=registerform)


@app.route('/reset', methods=['POST', 'GET'])
def reset():
    resetform = ResetForm()
    if request.method == 'POST':
        if resetform.validate_on_submit():
            username = resetform.username.data
            old_password = resetform.old_password.data
            new_password = resetform.new_password.data
            confirm_password = resetform.confirm_password.data
            if new_password != confirm_password:
                flash('确认密码必须和设置密码一致')
                return render_template('reset.html', resetform=resetform)
            user = mysql.session.query(User).filter_by(username=username).first()
            if user:
                if username == user.username and user.validate_password(old_password):
                    user.password_hash = new_password
                    user.set_password()
                    mysql.session.commit()
                    mysql.session.close()
                    flash('密码重置成功')
                    return redirect(url_for('login'))
                else:
                    flash('旧密码错误')
                    return render_template('reset.html', resetform=resetform)
            else:
                flash('该用户不存在')
                return render_template('reset.html', resetform=resetform)
    return render_template('reset.html', resetform=resetform)


@app.route('/edit_import', methods=['POST', 'GET'])
def edit_import():
    if request.method == 'POST':
        pname = request.form.get('pname')
        pname = pname.upper()
        pnumber = request.form.get('pnumber')
        pcost = request.form.get('pcost')
        form_type = request.form.get('form_type')
        if form_type == 'add-import':
            product_data = Product.query.filter_by(product_name=pname).first()
            if product_data:
                new_import = Import(import_product_id=product_data.product_id, import_number=pnumber,
                                    import_price=pcost)
                mysql.session.add(new_import)
        elif form_type == 'edit-import':
            iid = request.form.get('iid')
            imports = Import.query.filter_by(import_id=iid).first()
            imports.import_number = pnumber
            imports.import_price = pcost
        mysql.session.commit()
        mysql.session.close()
        return redirect(url_for('goods_import'))


@app.route('/arrival', methods=['POST', 'GET'])
def arrival():
    if request.method == 'POST':
        pname = request.form.get('pname')
        pname = pname.upper()
        iid = request.form.get('iid')
        imports = Import.query.filter_by(import_id=iid).first()
        product_data = Product.query.filter_by(product_name=pname).first()
        if product_data and imports:
            imports.is_arrival = 1
            all_cost = (product_data.product_repertory * product_data.product_cost + imports.import_number *
                        imports.import_price)
            product_data.product_repertory += imports.import_number
            product_data.product_cost = all_cost / product_data.product_repertory
        mysql.session.commit()
        mysql.session.close()
        return redirect(url_for('goods_import'))


@app.route('/delete_import', methods=['POST', 'GET'])
def delete_import():
    if request.method == 'POST':
        pname = request.form.get('pname')
        pname = pname.upper()
        iid = request.form.get('iid')
        imports = Import.query.filter_by(import_id=iid).first()
        product_data = Product.query.filter_by(product_name=pname).first()
        if product_data and imports:
            all_cost = (product_data.product_repertory * product_data.product_cost - imports.import_number *
                        imports.import_price)
            product_data.product_repertory -= imports.import_number
            if product_data.product_repertory == 0:
                product_data.product_cost = 0
            else:
                product_data.product_cost = all_cost / product_data.product_repertory
            mysql.session.delete(imports)
        mysql.session.commit()
        mysql.session.close()
        return redirect(url_for('goods_import'))


@app.route('/e_details', methods=['POST', 'GET'])
def e_details():
    if current_user.is_authenticated:
        form_type = request.form.get('form_type')
        if form_type != 'None':
            print(form_type)
            exp = Export.query.filter_by(export_id=form_type).first()
            if exp.export_deal != 1:
                values = exp.export_describe.split(',')
                for i in range(0, len(values), 3):
                    pname = values[i].strip()
                    product_data = Product.query.filter_by(product_name=pname).first()
                    if product_data:
                        pnum = int(values[i + 1].strip())
                        pcost = int(float(values[i + 2].strip()))
                        product_data.product_repertory -= pnum
                        print(pname, pnum, pcost)
                exp.export_deal = 1
                exp.export_employee_id = current_user.id
        else:
            ename = request.form.get('ename')
            employee = User.query.filter_by(username=ename).first()
            cname = request.form.get('cname')
            user = User.query.filter_by(username=cname).first()
            remarks = request.form.get('remarks')
            if not cname:
                flash('请填写客户名')
                return redirect(url_for('export_details'))
            plists = ""
            last_export = Export.query.order_by(Export.export_id.desc()).first()
            for i in range(3):
                pname = request.form.get('pname{}'.format(i + 1))
                product_data = Product.query.filter_by(product_name=pname).first()
                if product_data:
                    pnum = int(request.form.get('pnum{}'.format(i + 1)))
                    pcost = request.form.get('pcost{}'.format(i + 1))
                    product_data.product_repertory -= pnum
                    plists += f"{pname}, {pnum}, {pcost}, "
                    new_ex = Ex(export_id=(last_export.export_id + 1), product_name=pname,
                                number=pnum, price=pcost)
                    mysql.session.add(new_ex)
            if form_type == 'None':
                new_export = Export(export_id=(last_export.export_id + 1), export_user_id=user.id,
                                    export_employee_id=employee.id,
                                    export_describe=plists, export_deal='1', export_remark=remarks)
                mysql.session.add(new_export)
            else:
                ex = Export.query.filter_by(export_id=form_type).first()
                ex.export_user_id = user.id
                ex.export_remark = remarks
                ex.export_describe = plists
                ex.export_deal = 1
        mysql.session.commit()
        mysql.session.close()

        return redirect(url_for('goods_export'))


@app.route('/post_e', methods=['POST', 'GET'])
def post_e():
    if current_user.is_authenticated:
        username = current_user.username
        user = User.query.filter_by(username=username).first()
        h6content = request.form.get('h6Content')
        if user.shopping_cart is not None and user.shopping_cart != '':
            plists = ""
            cart_list2 = user.shopping_cart.split(',')
            last_export = Export.query.order_by(Export.export_id.desc()).first()
            for i in range(len(cart_list2)):
                if i % 2 == 0:
                    product_data = Product.query.filter_by(product_name=cart_list2[i]).first()
                    if product_data and product_data.sold_out == 0:
                        plists += f"{cart_list2[i]}, {cart_list2[i + 1]}, {product_data.suggested_price}, "
                        new_ex = Ex(export_id=(last_export.export_id + 1), product_name=cart_list2[i],
                                    number=cart_list2[i + 1], price=product_data.suggested_price)
                        mysql.session.add(new_ex)
            user.shopping_cart = None
            new_export = Export(export_id=(last_export.export_id + 1), export_user_id=user.id, export_describe=plists,
                                export_deal='0', export_remark=h6content)
            mysql.session.add(new_export)
            new_log = Logs(log_userid=user.id, log_details="提交了订单")
            mysql.session.add(new_log)
            mysql.session.commit()
            mysql.session.close()
            return redirect(url_for('products'))
    return "ok"


@app.route('/user_list', methods=['POST', 'GET'])
def user_list():
    pname = request.form.get('pname')
    users = User.query.with_entities(User.id, User.username, User.authority).all()
    if request.method == 'POST':
        users_list = [[user.id, user.username, user.authority] for user in users if pname in user.username]
    else:
        users_list = [[user.id, user.username, user.authority] for user in users]
    return jsonify(users_list)


@app.route('/product_list', methods=['POST', 'GET'])
def product_list():
    pname = request.form.get('pname')
    product = Product.query.order_by(asc(Product.sold_out), desc(Product.product_repertory)).all()
    if request.method == 'POST':
        if "其他" in pname.split(" "):
            # 定义一个包含“其他”品牌的列表
            other_brands = ['AMD', '华硕', '联想', '三星', '七彩虹', '戴尔', 'Intel']
            pname_parts = set(pname.split(" "))
            pname_parts.discard("其他")
            print(pname_parts)
            products_list = [[product.product_name, product.product_tag, product.suggested_price,
                              product.product_describe, product.product_image, product.sold_out,
                              product.product_repertory, product.product_cost]
                             for product in product
                             if not any(brand_name in product.product_name or
                                        brand_name in product.product_tag
                                        for brand_name in other_brands)
                             and all(pname_part in product.product_name or
                                     pname_part in product.product_tag
                                     for pname_part in pname_parts)]
        else:
            products_list = [[product.product_name, product.product_tag, product.suggested_price,
                              product.product_describe, product.product_image, product.sold_out,
                              product.product_repertory, product.product_cost]
                             for product in product if all(pname_part in product.product_name or
                                                           pname_part in product.product_tag
                                                           for pname_part in pname.split(" "))]
    else:
        products_list = [[product.product_name, product.product_tag, product.suggested_price,
                          product.product_describe, product.product_image, product.sold_out,
                          product.product_repertory, product.product_cost] for product in product]
    return jsonify(products_list)


@app.route('/request_list', methods=['POST', 'GET'])
def request_list():
    request1 = request.form.get('request')
    if request.method == 'POST':
        if request1 == "5":
            product = Product.query.order_by(Product.sold_out, desc(Product.product_id)).all()
            products_list = [[p.product_name, p.product_tag, p.suggested_price,
                              p.product_describe, p.product_image, p.sold_out,
                              p.product_repertory, p.product_cost] for p in product[:5]]
        else:
            product = Product.query.order_by(Product.sold_out, desc(Product.product_repertory)).all()
            p_data = Product.query.filter_by(product_name=request1).first()
            tags = re.split('[,，]', p_data.product_tag)
            products_list = sorted([[p.product_name, p.product_tag, p.suggested_price,
                        p.product_describe, p.product_image, p.sold_out,
                        p.product_repertory, p.product_cost] for p in product
                        if p != p_data and any(pname_part in p.product_tag for pname_part in tags)],
                       key=lambda x: sum(1 for pname_part in tags if pname_part in x[1]),
                       reverse=True)[:5]
        return jsonify(products_list)


@app.route('/before_after', methods=['POST', 'GET'])
def before_after():
    # 获取请求中的参数
    pname = request.form.get('pname')
    # 查询指定产品名的记录
    print(pname)
    product = Product.query.filter_by(product_name=pname).first()
    print(product)
    if product:
        # 查询前一行数据

        prev_product = Product.query.filter(Product.product_id < product.product_id).order_by(
            desc(text('product_form.product_id'))).first()

        if not prev_product:
            prev_product = Product.query.order_by(desc(text('product_form.product_id'))).first()
        prev_data = {
            'product_name': prev_product.product_name,
            'product_image': prev_product.product_image
        }

        # 查询后一行数据
        next_product = Product.query.filter(Product.product_id > product.product_id).order_by(
            asc(text('product_form.product_id'))).first()
        if next_product is None:
            # 如果当前记录是最后一行，则将第一行作为后一行
            next_product = Product.query.order_by(asc(text('product_form.product_id'))).first()
        next_data = {
            'product_name': next_product.product_name,
            'product_image': next_product.product_image
        }

        # 返回结果
        result = {
            'product_name': product.product_name,
            'product_tag': product.product_tag,
            'product_describe': product.product_describe,
            'product_price': product.suggested_price,
            'product_image': product.product_image,
            'prev_data': prev_data,
            'next_data': next_data
        }
        return jsonify(result)


@app.route('/import_list', methods=['POST', 'GET'])
def import_list():
    pname = request.form.get('pname')
    imports = Import.query.order_by(asc(Import.is_arrival)).all()
    if request.method == 'POST':
        imports_list = [[im.import_id, Product.query.get(int(im.import_product_id)).product_name,
                         im.import_number, im.import_price, im.is_arrival] for im in imports if
                        pname in Product.query.get(int(im.import_product_id)).product_name]
    else:
        imports_list = [[im.import_id, Product.query.get(int(im.import_product_id)).product_name,
                         im.import_number, im.import_price, im.is_arrival] for im in imports]
    return jsonify(imports_list)


@app.route('/log_list', methods=['POST', 'GET'])
def log_list():
    username = request.form.get('username')
    logs1 = Logs.query.all()
    if request.method == 'POST':
        logs_list = [[log.log_id, User.query.get(int(log.log_userid)).username,
                      log.log_details, log.log_time] for log in logs1 if str(username) == str(log.log_userid)]
    else:
        logs_list = [[log.log_id, User.query.get(int(log.log_userid)).username,
                      log.log_details, log.log_time] for log in logs1]
    # 对 logs_list 根据 log_time 进行排序，时间越晚越在前面
    logs_list_sorted = sorted(logs_list, key=lambda x: x[3], reverse=True)
    return jsonify(logs_list_sorted)


@app.route('/export_list', methods=['POST', 'GET'])
def export_list():
    pname = request.form.get('pname')
    exports = Export.query.order_by(asc(Export.export_deal), desc(Export.export_id)).all()
    if request.method == 'POST':
        exports_list = [
            [
                ex.export_id,
                User.query.get(int(ex.export_user_id)).username,
                User.query.get(int(ex.export_employee_id)).username if ex.export_employee_id else None,
                ex.export_describe,
                ex.export_deal,
                ex.export_remark
            ]
            for ex in exports if pname in User.query.get(
                int(ex.export_user_id)).username or pname in ex.export_describe or pname in ex.export_remark
        ]
    else:
        exports_list = [
            [
                ex.export_id,
                User.query.get(int(ex.export_user_id)).username,
                User.query.get(int(ex.export_employee_id)).username if ex.export_employee_id else None,
                ex.export_describe,
                ex.export_deal,
                ex.export_remark
            ]
            for ex in exports
        ]
    return jsonify(exports_list)


@app.route('/cart_list', methods=['POST', 'GET'])
def cart_list():
    if current_user.is_authenticated:
        username = current_user.username
        user = User.query.filter_by(username=username).first()
        if user.shopping_cart is not None and user.shopping_cart != '':
            cart_list2 = user.shopping_cart.split(',')
            if request.method == 'GET':
                products1 = []
                for i in range(len(cart_list2)):
                    if i % 2 == 0:
                        product = Product.query.filter_by(product_name=cart_list2[i]).first()
                        if product and product.sold_out == 0:
                            products1.append({
                                'product_name': product.product_name,
                                'suggested_price': product.suggested_price,
                                'product_image': product.product_image,
                                'sold_out': product.sold_out,
                                'product_number': cart_list2[i + 1]
                            })
                return jsonify(products1)
            else:
                data = request.get_json()
                # 提取pname参数
                pname = data.get('pname')
                cart_list1 = ','.join(pname)
                user.shopping_cart = cart_list1
                mysql.session.commit()
                mysql.session.close()
                return "ok"
        else:
            return "0"


@app.route('/delete_cart', methods=['POST', 'GET'])
def delete_cart():
    if current_user.is_authenticated:
        username = current_user.username
        user = User.query.filter_by(username=username).first()
        pname = request.form.get('pname')
        if user.shopping_cart is not None and user.shopping_cart != '':
            cart_list2 = user.shopping_cart.split(',')
            index1 = 0
            while index1 < len(cart_list2):
                if cart_list2[index1] == pname:
                    # 删除与 pname 相同的项及其后一项
                    del cart_list2[index1:index1 + 2]
                    break
                index1 += 1
            print(cart_list2)
            user.shopping_cart = ','.join(cart_list2)  # 更新用户的购物车字符串
            new_log = Logs(log_userid=user.id, log_details="删除购物车中的" + pname)
            mysql.session.add(new_log)
            mysql.session.commit()
            mysql.session.close()
            return "ok"
    return "no"


@app.route('/add_cart', methods=['POST', 'GET'])
def add_cart():
    if current_user.is_authenticated:
        pname = request.form.get('pname')
        value = request.form.get('value')
        username = current_user.username
        user1 = User.query.filter_by(username=username).first()
        if user1.shopping_cart is not None and user1.shopping_cart != '':
            cart_list1 = user1.shopping_cart.split(',')
        else:
            cart_list1 = []
        print(len(cart_list1))
        if len(cart_list1) > 20:
            return "no"
        cart_list1 = [item.strip() for item in cart_list1 if item.strip()]
        if pname in cart_list1:
            index1 = cart_list1.index(pname)  # 找到指定字符串的位置
            num = int(cart_list1[index1 + 1]) + int(value)  # 下一个字符串的数值加
            if num <= 0:
                # 如果数量小于等于0，则删除该商品及其数量
                del cart_list1[index1:index1 + 2]
            else:
                # 数量大于0则更新购物车数量
                cart_list1[index1 + 1] = str(num)
            user1.shopping_cart = ','.join(cart_list1)  # 更新用户的购物车字符串
        else:
            cart_list1.append(pname)  # 将指定字符串添加到购物车末尾
            cart_list1.append(value)  # 添加对应的初始数值
            user1.shopping_cart = ','.join(cart_list1)  # 更新用户的购物车字符串
        new_log = Logs(log_userid=user1.id, log_details="添加" + value + "个" + pname + "到购物车")
        mysql.session.add(new_log)
        mysql.session.commit()
        mysql.session.close()
        return "ok"


if __name__ == '__main__':
    mysql.create_all()

    app.run(debug=True,host='0.0.0.0',port=5000)
