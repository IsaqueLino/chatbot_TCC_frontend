'use client';
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, Input, Label, Spinner, Text } from '@fluentui/react-components';
import { PersonRegular, LockClosedRegular } from '@fluentui/react-icons';
import styles from './login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email,
        password,
      });

      if (res?.error) {
        setError('E-mail ou senha inválidos.');
      } else {
        router.push('/chat');
        router.refresh();
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <img src="/images/IFSP-LOGO.png" alt="IFSP Logo" className={styles.logoImage} />
          <h1 className={styles.title}>Agro Monitor</h1>
          <p className={styles.subtitle}>Sistema Inteligente de Agricultura de Precisão</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <Label htmlFor="email" className={styles.label}>E-mail</Label>
            <Input
              id="email"
              type="text"
              className={styles.fluentInput}
              value={email}
              onChange={(e, data) => setEmail(data.value)}
              placeholder="exemplo.@mail.com"
              contentBefore={<PersonRegular />}
              size="large"
              required
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="password" className={styles.label}>Senha</Label>
            <Input
              id="password"
              type="password"
              className={styles.fluentInput}
              value={password}
              onChange={(e, data) => setPassword(data.value)}
              placeholder="••••••••"
              contentBefore={<LockClosedRegular />}
              size="large"
              required
            />
          </div>

          {error && <Text className={styles.errorText}>{error}</Text>}

          <Button
            type="submit"
            appearance="primary"
            size="large"
            className={styles.loginButton}
            disabled={loading}
            icon={loading ? <Spinner size="tiny" /> : undefined}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
}