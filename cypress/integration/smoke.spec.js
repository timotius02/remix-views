describe("smoke test", () => {
  it("should navigate from home page to search with the correct term", () => {
    cy.visit("/");
    cy.contains("Do you know your youtubers?");
    cy.log("Checking Home Page");
    cy.get('input[name="term"]').type("toast");

    cy.get('button[type="submit"]').click();

    cy.contains("Disguised Toast");
    cy.url().should("include", "term=toast");
  });
});
