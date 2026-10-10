import { FormEvent, useState } from "react";
import { loginSchema } from "../config/login-schema";
import "../styles/Login.css";

type TLoginFormErrors = {
  email?: string;
  password?: string;
};

type TLoginProps = {
  onLoginSuccess: () => void;
};

function Login({ onLoginSuccess }: TLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<TLoginFormErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const nextErrors: TLoginFormErrors = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0];
        if ((field === "email" || field === "password") && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onLoginSuccess();
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-mark" aria-hidden="true">
          W
        </div>
        <p className="login-eyebrow">Webhooks</p>
        <h1 id="login-title">З поверненням</h1>
        <p className="login-description">Увійдіть до свого облікового запису</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={event => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p className="field-error" id="email-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Введіть пароль"
              value={password}
              onChange={event => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && (
              <p className="field-error" id="password-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <button className="login-button" type="submit">
            Увійти <span aria-hidden="true">→</span>
          </button>
        </form>
        <p className="login-note">Безпечний доступ до ваших вебхуків</p>
      </section>
    </main>
  );
}

export default Login;
