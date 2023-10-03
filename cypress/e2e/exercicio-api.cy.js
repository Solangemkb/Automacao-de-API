/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

var faker = require('faker');

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          //TODO: 
          cy.request('usuarios').then(response => {
               return contrato.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
          })
     });

     it('Deve cadastrar um usuário com sucesso', () => {
          //TODO:
          let nomeFaker = faker.name.firstName()
          let sobrenomeFaker = faker.name.lastName()
          let emailFaker = faker.internet.email(nomeFaker)
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": nomeFaker + sobrenomeFaker,
                    "email": emailFaker,
                    "password": "teste",
                    "administrador": "true"
               }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     });

     it('Deve validar um usuário com email inválido', () => {
          //TODO:
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "Fulano da Silva",
                    "email": "Fulano",
                    "password": "teste",
                    "administrador": "true"
               },
               failOnStatusCode: false
          }).then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.email).to.equal('email deve ser um email válido')
          })
     });
     
     it('Deve editar um usuário previamente cadastrado', () => {
          //TODO: 
          let nomeFaker = faker.name.firstName()
          let sobrenomeFaker = faker.name.lastName()
          let emailFaker = faker.internet.email(nomeFaker)

          cy.cadastrarUsuario(nomeFaker, sobrenomeFaker, emailFaker)
               .then((response) => {
                    let id = response.body._id
                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         body: {
                              "nome": nomeFaker + sobrenomeFaker,
                              "email": emailFaker,
                              "password": "teste",
                              "administrador": "true"
                         }
                    }).then(response => {
                         expect(response.status).to.equal(200)
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })
               })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          //TODO: 
          let nomeFaker = faker.name.firstName()
          let sobrenomeFaker = faker.name.lastName()
          let emailFaker = faker.internet.email(nomeFaker)

          cy.cadastrarUsuario(nomeFaker, sobrenomeFaker, emailFaker)
          .then((response) => {
               let id = response.body._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`
               }).then(response =>{
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
               })    
                   
          });

     });
});
