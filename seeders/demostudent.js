module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Students", [
            {
                classId: 1,
                studentName: "Ye",
                studentGender: "None of ur business",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ])
    }
}