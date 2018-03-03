// @ts-check
/// <reference types="Cypress" />

import {foo} from '../foo'

describe('Cypress with Parcel preprocessor', () => {
  it('has imported foo from another file', () => {
    cy.wrap(foo).should('be.equal', 'foo')
  })
})
