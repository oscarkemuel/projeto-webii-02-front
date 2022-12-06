/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-constructed-context-values */
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect
} from 'react';
import { toast } from 'react-toastify';
import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import api from '../services/api';
import FullLoading from '../components/FullLoading';
import { Store } from '../types';

interface ISignInData {
  email: string;
  password: string;
}

interface ISignInResponse {
  token: {
    token: string;
    expiresAt: string;
    expiresIn: number;
  };
  user: User;
}

export type User = {
  id: number;
  email: string;
  name: string;
  phone: string;
  is_admin: 0 | 1;
  address_id: number;
  created_at: string;
  updated_at: string;
  stores: Store[];
};

type AuthContextType = {
  isAuthenticated: boolean;
  signIn: (data: ISignInData) => Promise<void>;
  signOut: () => void;
  user: User | null;
  isLoadingSplash: boolean;
  signinIsLoading: boolean;
};

interface ProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: ProviderProps): JSX.Element {
  const [isLoadingSplash, setIsLoadingSplash] = useState(true);
  const [signinIsLoading, setSigninIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  function signOut(): void {
    api
      .delete('/auth/logout')
      .then(() => {
        setUser(null);
        destroyCookie(undefined, 'authtoken');
        Router.push('/');
      })
      .catch((error) => toast.error(error.response.data.message));
  }

  useEffect(() => {
    const { authtoken } = parseCookies();

    async function getUser(): Promise<void> {
      await api
        .get(`/auth/me`)
        .then(({ data }) => {
          setUser(data.user);
        })
        .catch(() => {
          setUser(null);
          destroyCookie(undefined, 'authtoken');
          Router.push('/login');
        })
        .finally(() => setIsLoadingSplash(false));
    }

    if (authtoken) {
      getUser();
    } else {
      setIsLoadingSplash(false);
    }
  }, []);

  async function signIn({ email, password }: ISignInData): Promise<void> {
    setSigninIsLoading(true);

    await api
      .post<ISignInResponse>('/auth/login', { email, password })
      .then(({ data }) => {
        const { token, user: newUser } = data;

        setCookie(undefined, 'authtoken', token.token, {
          maxAge: token.expiresIn
        });

        setUser(newUser);

        api.defaults.headers.common.Authorization = `Bearer ${token.token}`;
        toast.success('Login realizado com sucesso!');

        Router.push(`/`);
      })
      .catch((error) => toast.error(error.response.data.message))
      .finally(() => setSigninIsLoading(false));
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        user,
        signOut,
        isLoadingSplash,
        signinIsLoading
      }}>
      {isLoadingSplash ? <FullLoading isLoading={isLoadingSplash} /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used whitn an AuthProvider');

  return context;
}
