import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react'

function ForgotPassword() {
  const [step, setStep] = useState(1) // 1: Enter email/phone, 2: Enter OTP + New password
  const [loginType, setLoginType] = useState('email')
  const [contact, setContact] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!contact) {
      alert('Vui lòng nhập email hoặc số điện thoại')
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
      setCountdown(60)
      alert(`Đã gửi mã OTP đến ${contact}`)
    }, 1000)
  }

  const handleResendOTP = () => {
    if (countdown > 0) return
    
    setCountdown(60)
    alert(`Đã gửi lại mã OTP đến ${contact}`)
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    
    if (!otp || otp.length !== 6) {
      alert('Vui lòng nhập mã OTP 6 số')
      return
    }
    
    if (!newPassword || newPassword.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }
    
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp')
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      alert('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.')
      // Redirect to login
      window.location.href = '/login'
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Left Column - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-blue-700 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
              <Lock className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">KHO AI</h1>
              <p className="text-blue-100 text-sm">Quản lý kho thông minh</p>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Quên mật khẩu?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Đừng lo lắng! Chúng tôi sẽ giúp bạn đặt lại mật khẩu. Nhập email hoặc số điện thoại của bạn để nhận mã xác thực.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-blue-50">Nhận mã OTP qua email hoặc SMS</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-blue-50">Đặt lại mật khẩu mới an toàn</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <p className="text-blue-50">Bảo vệ tài khoản của bạn</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-blue-100">
          © 2024 KHO AI. All rights reserved.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">KHO AI</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Quản lý kho thông minh</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            {step === 1 ? (
              <>
                <div className="mb-8">
                  <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại đăng nhập
                  </Link>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quên mật khẩu</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Nhập email hoặc số điện thoại để nhận mã xác thực
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-6">
                  {/* Login Type Toggle */}
                  <div>
                    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                      <button
                        type="button"
                        onClick={() => setLoginType('email')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                          loginType === 'email'
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                        }`}
                      >
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginType('phone')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                          loginType === 'phone'
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
                        }`}
                      >
                        <Phone className="w-4 h-4 inline mr-1" />
                        Số điện thoại
                      </button>
                    </div>

                    {/* Email Input */}
                    {loginType === 'email' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}

                    {/* Phone Input */}
                    {loginType === 'phone' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Số điện thoại
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            placeholder="0901234567"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Đang gửi...' : 'Gửi mã xác thực'}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-8">
                  <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-primary mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại đăng nhập
                  </Link>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Đặt lại mật khẩu</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Nhập mã OTP và mật khẩu mới
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  {/* OTP Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mã OTP
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength="6"
                        placeholder="Nhập mã 6 số"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl tracking-widest"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={countdown > 0}
                        className="text-sm text-primary hover:text-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {countdown > 0 ? `Gửi lại mã (${countdown}s)` : 'Gửi lại mã'}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-success text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
            © 2024 KHO AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword