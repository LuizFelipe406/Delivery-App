import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { registerSchema } from '../schemas/registerSchema';
import requestApi from '../utils/RequestAPI';
import rock from '../images&Info/rockGlass.svg';
import userIcon from '../images&Info/user-icon.png';
import Footer from '../components/Footer/Footer';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [badRegister, setBadRegister] = useState(false);
  const setUser = useLocalStorage('user', {})[1];
  const history = useHistory();
  const classInput = `p-2 border-b border-grey focus:outline-none focus:border-yellow 
  focus:border-b-2`;

  useEffect(() => {
    const enabledButton = () => {
      const { error } = registerSchema.validate({ name, email, password });
      if (!error) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    };

    enabledButton();
  }, [name, email, password]);

  const handleNameChange = (event) => {
    const { value } = event.target;
    setBadRegister(false);
    setName(value);
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setBadRegister(false);
    setEmail(value);
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setBadRegister(false);
    setPassword(value);
  };

  const register = async () => {
    const successStatus = 201;

    const { status } = await requestApi('POST', 'register', {
      name,
      email,
      password,
    });

    if (status === successStatus) {
      const { data } = await requestApi('POST', 'login', { email, password });
      setUser({
        ...data.user,
        token: data.token,
      });
      history.push('/customer/products');
    }
    setBadRegister(true);
  };

  const invalidRegisterMessage = (
    <span
      data-testid="common_register__element-invalid_register"
      className="text-red-500 font-bold absolute translate-y-[525px]"
    >
      Dados inválidos
    </span>);

  return (
    <div className="flex justify-center items-center my-44">
      <div className="mr-14 animate-slide-to-right">
        <img alt="Imagem ilustrativa" src={ rock } />
      </div>
      <div className="flex flex-col items-center pl-14 border-l border-grey w-min">
        <img alt="Icone perfil" src={ userIcon } className="pb-6 animate-slide-to-left" />
        <h3 className="text-2xl mb-4 animate-slide-to-left">Cadastro</h3>
        <form className="flex flex-col items-center w-min p-4 animate-slide-to-left">
          <label htmlFor="name-input-register">
            Nome
            <input
              onChange={ handleNameChange }
              data-testid="common_register__input-name"
              id="name-input-register"
              type="name"
              placeholder="Seu Nome"
              className={ classInput }
            />
          </label>
          <label htmlFor="email-input-register" className="mt-10">
            Email
            <input
              onChange={ handleEmailChange }
              data-testid="common_register__input-email"
              id="email-input-register"
              type="email"
              placeholder="seu-email@site.com.br"
              className={ classInput }
            />
          </label>
          <label htmlFor="password-input-register" className="mt-10">
            Senha
            <input
              onChange={ handlePasswordChange }
              data-testid="common_register__input-password"
              id="password-input-register"
              type="password"
              placeholder="***********"
              className={ classInput }
            />
          </label>
          <div className="flex justify-around w-full">
            <button
              onClick={ register }
              type="button"
              data-testid="common_register__button-register"
              disabled={ isDisabled }
              className="mt-4 h-min rounded-sm p-2 bg-yellow text-black text-xs font-bold
              disabled:bg-grey disabled:text-white"
            >
              CADASTRAR
            </button>
            <button
              onClick={ () => history.push('/login') }
              type="button"
              data-testid="common_register__button-register"
              className="mt-4 h-min rounded-sm p-2 text-xs font-bold bg-black text-white"
            >
              VOLTAR
            </button>
          </div>
        </form>
        { badRegister && invalidRegisterMessage }
      </div>
      <Footer />
    </div>
  );
}
