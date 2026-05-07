const nodemailer = require('nodemailer');

const normalizeOrigin = (value) => (value || '').trim().replace(/\/+$/, '');

const getClientUrl = () => {
  const raw = process.env.CLIENT_URL || process.env.FRONTEND_URL || '';
  // Support comma-separated list (same pattern as CORS config)
  const first = raw.split(',')[0];
  const normalized = normalizeOrigin(first);
  if (normalized) return normalized;

  // Fall back for local dev; in production this should be set
  if ((process.env.NODE_ENV || '').toLowerCase() === 'production') {
    console.warn('CLIENT_URL is not set; verification emails may contain localhost links.');
  }
  return 'http://localhost:3000';
};

const getSmtpCreds = () => {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
  return { user, pass };
};

const createTransporter = () => {
  const { user, pass } = getSmtpCreds();
  if (!user || !pass) {
    throw new Error('Email is not configured (missing SMTP/EMAIL credentials)');
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user,
      pass,
    },
  });
};

const sendWelcomeEmail = async (user) => {
  const { user: smtpUser } = getSmtpCreds();
  const transporter = createTransporter();
  const clientUrl = getClientUrl();
  await transporter.sendMail({
    from: `"GLearnPlatform" <${smtpUser}>`,
    to: user.email,
    subject: '🎮 Welcome to GLearnPlatform - Start Your Learning Journey!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:30px;border-radius:12px;">
        <h1 style="color:#6366f1;text-align:center;">🎮 Welcome to GLearnPlatform!</h1>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Welcome aboard! Your learning adventure starts now. Earn XP, collect badges, and rise to the top of the leaderboard.</p>
        <div style="background:#1e293b;padding:20px;border-radius:8px;margin:20px 0;">
          <h3 style="color:#818cf8;">🚀 Your Starting Stats</h3>
          <p>✨ XP: 0 | Level: 1 | Streak: 0 days</p>
        </div>
        <p style="text-align:center;margin-top:20px;">
          <a href="${clientUrl}" style="background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Start Learning Now
          </a>
        </p>
      </div>
    `,
  });
};

const sendBadgeEmail = async (user, badge) => {
  const { user: smtpUser } = getSmtpCreds();
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"GLearnPlatform" <${smtpUser}>`,
    to: user.email,
    subject: `🏆 You earned the "${badge.name}" badge!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:30px;border-radius:12px;">
        <h1 style="color:#f59e0b;text-align:center;">${badge.icon} Achievement Unlocked!</h1>
        <p>Congratulations <strong>${user.name}</strong>!</p>
        <p>You've earned the <strong style="color:#f59e0b;">${badge.name}</strong> badge!</p>
        <p style="color:#94a3b8;">${badge.description}</p>
        <p>+${badge.xpReward} XP | +${badge.pointsReward} Points</p>
      </div>
    `,
  });
};

const sendVerificationEmail = async (user, token) => {
  const { user: smtpUser } = getSmtpCreds();
  const transporter = createTransporter();
  const clientUrl = getClientUrl();
  const verificationUrl = `${clientUrl}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"GLearnPlatform" <${smtpUser}>`,
    to: user.email,
    subject: '📧 Verify Your Email - GLearnPlatform',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:30px;border-radius:12px;">
        <h1 style="color:#6366f1;text-align:center;">📧 Verify Your Email</h1>
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Thank you for signing up! Please verify your email address to activate your account and start your learning journey.</p>
        <div style="background:#1e293b;padding:20px;border-radius:8px;margin:20px 0;text-align:center;">
          <p style="margin:0;color:#94a3b8;">Click the button below to verify your email:</p>
        </div>
        <p style="text-align:center;margin:20px 0;">
          <a href="${verificationUrl}" style="background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
            ✓ Verify Email
          </a>
        </p>
        <p style="color:#94a3b8;font-size:12px;">Or copy this link: <br><span style="word-break:break-all;">${verificationUrl}</span></p>
        <p style="color:#94a3b8;font-size:12px;margin-top:20px;">This verification link expires in 24 hours.</p>
      </div>
    `,
  });
};

module.exports = { sendWelcomeEmail, sendBadgeEmail, sendVerificationEmail };
