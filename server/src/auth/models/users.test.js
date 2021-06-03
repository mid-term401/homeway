const users = require("./users");
// @ponicode
describe("users.handleSignIn", () => {
  test("0", async () => {
    let result = await users.handleSignIn(
      {
        user: {
          userData: { category: false, user_name: "user123", id: "myDIV" },
          success: 404,
        },
      },
      200
    );
    expect(result).toBe(undefined);
  });

  test("1", async () => {
    let result = await users.handleSignIn(
      {
        user: {
          userData: {
            category: "number",
            user_name: "TestUpperCase@Example.com",
            id: "myDIV",
          },
          success: 429,
        },
      },
      400
    );
    expect(result).toBe(undefined);
  });
});
