import React, { useState } from 'react';
import { User, LogOut, Settings, ShieldCheck, Mail, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../lib/supabase';

interface ProfileProps {
  user: any | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogin, onLogout }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await auth.signUp(email, password);
        if (error) throw error;
        alert('注册成功！请查收邮箱验证邮件。');
      } else {
        const { error } = await auth.signIn(email, password);
        if (error) throw error;
      }
      setShowLogin(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      onLogout();
    } catch (err) {
      console.error('登出失败', err);
    }
  };

  if (!user) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-mystic-accent/10 flex items-center justify-center">
            <User className="w-12 h-12 text-mystic-accent" />
          </div>
          <h2 className="text-2xl font-cursive text-mystic-text mb-2">未登录</h2>
          <p className="text-mystic-muted mb-8">登录后可云端同步占卜记录</p>
          
          <button
            onClick={() => setShowLogin(true)}
            className="px-8 py-4 bg-gradient-to-r from-mystic-accent to-yellow-600 text-mystic-bg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            登录 / 注册
          </button>
        </div>

        {showLogin && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8 relative">
              <button
                onClick={() => {
                  setShowLogin(false);
                  setError('');
                }}
                className="absolute top-4 right-4 text-mystic-muted hover:text-mystic-text"
              >
                ✕
              </button>

              <h3 className="text-2xl font-cursive text-mystic-text mb-6 text-center">
                {isSignUp ? '注册账号' : '登录'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm text-mystic-muted mb-2">
                    <Mail className="w-4 h-4" /> 邮箱
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-mystic-accent/20 rounded-xl text-mystic-text focus:border-mystic-accent focus:ring-2 focus:ring-mystic-accent/20 outline-none"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-mystic-muted mb-2">
                    <Lock className="w-4 h-4" /> 密码
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-mystic-accent/20 rounded-xl text-mystic-text focus:border-mystic-accent focus:ring-2 focus:ring-mystic-accent/20 outline-none"
                    placeholder="至少 6 位密码"
                    minLength={6}
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm text-center">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-mystic-accent to-yellow-600 text-mystic-bg font-bold rounded-xl disabled:opacity-50"
                >
                  {loading ? '处理中...' : (isSignUp ? '注册' : '登录')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-mystic-muted hover:text-mystic-accent"
                >
                  {isSignUp ? '已有账号？去登录' : '没有账号？去注册'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="glass-card p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-mystic-accent to-yellow-600 flex items-center justify-center text-mystic-bg text-2xl font-bold">
            {user.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-cursive text-mystic-text">{user.email}</h2>
            <div className="flex items-center gap-2 text-xs text-mystic-muted mt-1">
              <ShieldCheck className="w-3 h-3" />
              已登录
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
            <Settings className="w-5 h-5 text-mystic-accent" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-mystic-text">账号设置</h3>
              <p className="text-xs text-mystic-muted">管理个人信息和偏好</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <div className="flex-1 text-left">
              <h3 className="text-sm font-semibold text-red-400">退出登录</h3>
              <p className="text-xs text-red-400/60">退出当前账号</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
