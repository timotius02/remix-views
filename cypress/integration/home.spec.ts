describe("test homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should navigate to the correct game after clicking a card", () => {
    cy.get("li > a")
      .first()
      .then(($a) => {
        const id = $a.attr("href").split("/").pop();
        cy.get("li > a").first().click();
        cy.url().should("include", `/playlist/${id}`);
      });
  });

  it("should navigate from home page to search with the correct term", () => {
    cy.contains("Do you know your youtubers?");
    cy.log("Checking Home Page");
    cy.get('input[name="term"]').type("toast");

    cy.get('button[type="submit"]').click();

    cy.contains("Disguised Toast");
    cy.url().should("include", "term=toast");
  });

  it("should navigate from home to Custom Game when you click Custom Game button", () => {
    cy.contains("Custom Game").click();
    cy.url().should("include", "/new");
  });
});
