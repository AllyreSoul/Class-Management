module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Users", [
            {
                firstName: "Stella",
                lastName: "Aurelia",
                dob: new Date(2020, 11, 25),
                gender: "Female",
                email:"Stellsies82@gmail.com",
                password:"CreativePass123",
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ])
    }
}