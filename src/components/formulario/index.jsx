import React, { useState } from "react";
import "./styles.scss";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import { Button } from "../button";
import $ from "jquery";

export const Formulario = () => {
  const [name, setName] = useState(""); // Estado para controlar o nome
  const [erroName, setErroName] = useState(""); // Estado para controlar o erro do nome
  const [idade, setIdade] = useState(""); // Estado para controlar o idade
  const [erroIdade, setErroIdade] = useState(""); // Estado para controlar o erro da idade
  const [cpf, setCpf] = useState(""); // Estado para controlar o cpf
  const [erroCpf, setErroCpf] = useState(""); // Estado para controlar o erro do cpf
  const [cep, setCep] = useState(""); // Estado para controlar o cep
  const [erroCep, setErroCep] = useState(""); // Estado para controlar o erro do cep
  const [dados, setDados] = useState(null); // Estado para receber os dados da API
  const [erro, setErro] = useState(null); // Estado para receber o erro vindo da API

  const handleSubmit = (e) => {
    e.preventDefault();

    // Limpa os erros para uma nova validação
    clearErrors();

    console.log("name", !name || name.trim().length == 0);
    // Valida se preencheu nome
    if (!name || name.trim().length == 0) {
      setErroName("Campo obrigatório");
    }

    console.log("idade", !idade || idade.trim().length == 0);
    // Valida se preencheu idade
    if (!idade || idade.trim().length == 0) {
      setErroIdade("Campo obrigatório");
    }

    console.log("idade", idade.replace(/[0-9]/g, "").length > 0);
    // Valida se preencheu apenas com numeros
    if (idade.replace(/[0-9]/g, "").length > 0) {
      setErroIdade("A idade só pode contar números");
    }

    console.log("cep", !cep || cep.trim().length == 0);
    // Valida se preencheu cep
    if (!cep || cep.trim().length == 0) {
      setErroCep("Campo obrigatório");
    }

    console.log("cpf", !cpf || cpf.trim().length == 0);
    // Valida se preencheu cpf
    if (!cpf || cpf.trim().length == 0) {
      setErroCpf("Campo obrigatório");
    }

    // Remover formatação do CPF antes de validar
    const rawCpf = cpf.replace(/\D/g, "");

    // Validar CPF antes do envio
    if (!isCpf(rawCpf)) {
      setErroCpf("CPF inválido");
    }

    console.log(erroName, erroIdade, erroCep, erroCpf);

    // Valida o formulario contem erros
    if (erroName || erroIdade || erroCep || erroCpf) {
      return;
    }

    toast.dark("Mensagem enviada com Sucesso!");

    //limpeza de dados, mudando para o estado inicial.
    clearForm();
  };

  // Função para limpar os estados do formulário
  function clearForm() {
    setName("");
    setIdade("");
    setCpf("");
    setCep("");
    setDados(null);
    clearErrors();
  }

  // Função para limpar os erros do formulário
  function clearErrors() {
    setErro(null);
    setErroName(null);
    setErroIdade(null);
    setErroCpf(null);
    setErroCep(null);
  }

  // Função para validar CPF
  function isCpf(cpf) {
    const exp = /\.|-/g;
    cpf = cpf.toString().replace(exp, "");

    if (
      cpf.length != 11 ||
      cpf == "00000000000" ||
      cpf == "11111111111" ||
      cpf == "22222222222" ||
      cpf == "33333333333" ||
      cpf == "44444444444" ||
      cpf == "55555555555" ||
      cpf == "66666666666" ||
      cpf == "77777777777" ||
      cpf == "88888888888" ||
      cpf == "99999999999"
    )
      return false;

    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);

    let rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) return false;

    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);

    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;

    return !(rev != parseInt(cpf.charAt(10)));
  }

  // Função para formatar o CPF
  const formatCpf = (cpf) => {
    cpf = cpf.replace(/\D/g, ""); // Remove qualquer caractere não numérico
    if (cpf.length <= 3) return cpf;
    if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
    if (cpf.length <= 9)
      return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(
      6,
      9
    )}-${cpf.slice(9, 11)}`;
  };

  // Função para a chamada de formatação do cpf
  const handleCpfChange = (e) => {
    const formattedCpf = formatCpf(e.target.value);
    setCpf(formattedCpf);
  };

  const handleCepChange = (e) => {
    // Obtém o valor do campo e remove caracteres não numéricos
    const cepValor = e.target.value.replace(/\D/g, "");
    if (cepValor.length <= 8) {
      // Limita o comprimento do CEP para 8 caracteres
      setCep(cepValor);
    } // Atualiza o estado com o valor do CEP
  };

  // Função para consultar os dados da API
  const buscarDados = () => {
    setDados(null);
    setErro(null);
    $.ajax({
      url: `https://viacep.com.br/ws/${cep}/json/`, // URL da API
      type: "GET",
      dataType: "json",
      success: function (response) {
        setDados(response); // Armazena os dados recebidos no estado
      },
      error: function (xhr, status, error) {
        setErro("Ocorreu um erro ao buscar os dados.");
      },
    });
  };

  return (
    <form id='formularioContato' onSubmit={handleSubmit}>
      <div className='forms-body'>
        <div className='forms'>
          <div className='sub-title-body'>
            <div className='style-next'>
              <div className='style-box-name'>
                <h4 className='sub-title'>
                  Nome
                  <Tooltip title='campo obrigatório'>
                    <span>*</span>
                  </Tooltip>
                </h4>
                <input
                  className='sub-title-box'
                  value={name}
                  type='name'
                  required
                  onChange={(e) => setName(e.target.value)}
                />
                {erroName && <span style={{ color: "red" }}>{erroName}</span>}
              </div>
              <div className='style-box-name'>
                <h4 className='sub-title'>
                  Idade
                  <Tooltip title='campo obrigatório'>
                    <span>*</span>
                  </Tooltip>
                </h4>
                <input
                  className='sub-title-box'
                  value={idade}
                  type='number'
                  required
                  onChange={(e) => setIdade(e.target.value)}
                />
                {erroIdade && <span style={{ color: "red" }}>{erroIdade}</span>}
              </div>
              <div className='style-box-name'>
                <h4 className='sub-title'>
                  CPF
                  <Tooltip title='campo obrigatório'>
                    <span>*</span>
                  </Tooltip>
                </h4>
                <input
                  className='sub-title-box'
                  value={cpf}
                  type='text'
                  required
                  onChange={handleCpfChange}
                  id='cpf'
                  placeholder='000.000.000-00'
                />
                {erroCpf && <span style={{ color: "red" }}>{erroCpf}</span>}
              </div>
            </div>

            <div className='style-long-latd'>
              <div className='style-box-name'>
                <h4 className='sub-title'>
                  Cep
                  <Tooltip title='campo obrigatório'>
                    <span>*</span>
                  </Tooltip>
                </h4>
                <input
                  className='sub-title-box'
                  value={cep}
                  type='text'
                  required
                  onChange={handleCepChange}
                  placeholder='000000-00'
                />
                {erroCep && <span style={{ color: "red" }}>{erroCep}</span>}
                <button type='button' onClick={buscarDados}>
                  Buscar Cep
                </button>
              </div>
              {erro && <p style={{ color: "red" }}>{erro}</p>}

              {dados && !erro && (
                <div className='style-inline-box'>
                  <div className='style-box-name'>
                    <h4 className='sub-title'>Cidade</h4>
                    <input
                      className='sub-title-box'
                      value={dados.localidade}
                      readOnly
                    />
                  </div>
                  <div className='style-box-name'>
                    <h4 className='sub-title'>Bairro</h4>
                    <input
                      className='sub-title-box'
                      value={dados.bairro}
                      readOnly
                    />
                  </div>
                  <div className='style-box-name'>
                    <h4 className='sub-title'>Logradouro</h4>
                    <input
                      className='sub-title-box'
                      value={dados.logradouro}
                      readOnly
                    />
                  </div>
                  <div className='style-box-name'>
                    <h4 className='sub-title'>Estado</h4>
                    <input
                      className='sub-title-box'
                      value={dados.estado}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='button-wrapper'>
            <Button onClick={handleSubmit}> ENVIAR</Button>
          </div>
        </div>
      </div>
    </form>
  );
};
