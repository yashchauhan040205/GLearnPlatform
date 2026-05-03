const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
};

const sendWelcomeEmail = async (user) => {
  if (!process.env.SMTP_USER) return;
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"GLearnPlatform" <${process.env.SMTP_USER}>`,
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
          <a href="${process.env.CLIENT_URL}" style="background:#6366f1;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Start Learning Now
          </a>
        </p>
      </div>
    `,
  });
};

const sendBadgeEmail = async (user, badge) => {
  if (!process.env.SMTP_USER) return;
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"GLearnPlatform" <${process.env.SMTP_USER}>`,
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
  if (!process.env.SMTP_USER) return;
  const transporter = createTransporter();
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"GLearnPlatform" <${process.env.SMTP_USER}>`,
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
