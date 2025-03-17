import './auth.css'
function Auth() {
    return (
        <>
            <div className='auth'>
                <div className='auth__header'>
                    <img src='../../public/img/logo.png' className='logo' />
                </div>
                <div className='linear'></div>
                <div className="auth-container">
                    <div className='auth-form'>
                        <h2 className='auth-form__title'>Đăng nhập</h2>
                        <form>
                            <label for='username'>Tài khoản</label><br />
                            <input type='text' id='username' name='username' /><br />
                            <label for='password'>Mật khẩu</label><br />
                            <input type='password' id='password' name='password' /><br />
                            <button type='submit'>Đăng nhập</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Auth;