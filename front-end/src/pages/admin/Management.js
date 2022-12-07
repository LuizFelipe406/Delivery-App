import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar/NavBar';
import requestApi from '../../utils/RequestAPI';

function Management() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [badRegister, setBadRegister] = useState(false);

  useEffect(() => {
    const enabledButton = () => {
      const minName = 12;
      const minPassword = 6;
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      if (
        emailRegex.test(email)
        && password.length >= minPassword
        && name.length >= minName
        && role
      ) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    };

    enabledButton();
  }, [name, email, password, role]);

  const handleNameChange = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
  };

  const handleRoleChange = (event) => {
    const { value } = event.target;
    setRole(value);
  };

  const register = async () => {
    const successStatus = 201;

    const { status } = await requestApi('POST', 'register/admin', {
      name,
      email,
      password,
      role,
    });

    if (status === successStatus) {
      const { data } = await requestApi('POST', 'login', {
        email,
        password,
      });
      setUser(data.user);
      // setToken(data.token);
    }
    setBadRegister(true);
  };

  const invalidRegisterMessage = (
    <span
      data-testid="admin_manage__element-invalid-register"
    >
      Dados inválidos
    </span>);

  return (
    <div>
      <NavBar />
      <p>Cadastrar novo usuário</p>
      <form>
        <label htmlFor="name-input-admin-manage">
          Nome
          <input
            onChange={ handleNameChange }
            data-testid="admin_manage__input-name"
            id="name-input-admin-manage"
            type="name"
            placeholder="Nome e sobrenome"
          />
        </label>
        <label htmlFor="email-input-admin-manage">
          Email
          <input
            onChange={ handleEmailChange }
            data-testid="admin_manage__input-email"
            id="email-input-admin-manage"
            type="email"
            placeholder="seu-email@site.com.br"
          />
        </label>
        <label htmlFor="password-input-admin-manage">
          Senha
          <input
            onChange={ handlePasswordChange }
            data-testid="admin_manage__input-password"
            id="password-input-admin-manage"
            type="password"
            placeholder="**********"
          />
        </label>
        <label htmlFor="role-select-admin-manage">
          Tipo
          <select
            onChange={ handleRoleChange }
            data-testid="admin_manage__select-role"
            id="role-select-admin-manage"
          >
            <option selected value="customer">Cliente</option>
            <option value="seller">Vendedor</option>
            <option value="administrator">Administrador</option>
          </select>
        </label>
        { badRegister && invalidRegisterMessage }
        <button
          onClick={ register }
          type="button"
          data-testid="admin_manage__button-register"
          disabled={ isDisabled }
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default Management;
