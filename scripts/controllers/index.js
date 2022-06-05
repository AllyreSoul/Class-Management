const bcrypt = require('bcrypt');
const { ClassBody } = require('requirejs');
const user = require('../../models/user');
const User = require('../../models').User;
const Classes = require('../../models').Classes;
const Students = require('../../models').Students;

var userVar;
var classVar;

const Home = async (req, res) => {
    classVar = null;
    const name = req.session.name
    let user;
    if (req.session.authenticate) {
        const id = userVar.id;
        user = await User.findOne({
            where: { id: id },
            include: Classes,
        })
        console.log(JSON.stringify(user, null, 2));
    }
    res.render("index.ejs", {
        name, isLoggedIn: req.session.authenticate, user
    })
}

const loginPage = (req, res) => {
    res.render("login.ejs")
}

const loginRequest = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.render("login.ejs", {
            error: "Please input an Email and Password"
        });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
        res.render("login.ejs", {
            error: "User not found"
        })
    } else {
        const isPassValid = bcrypt.compare(password, user.password)
        console.log(`Input is ${password}, expected input is ${user.password}`);
        console.log(isPassValid)
        if (!isPassValid) {
            res.render("login.ejs", {
                error: "Incorrect login Credentials",
            });
            return;
        }
        req.session.authenticate = true;
        req.session.name = user.firstName + " " + user.lastName;
        req.session.id = user.id;

        userVar = user;
        res.redirect("/");
    }
}

const registerPage = (req, res) => {
    res.render("register.ejs")
}

const registerRequest = async (req, res) => {
    const { firstName, lastName, email, dob, gender, password, repeatPassword } = req.body;
    if (!firstName, !lastName, !email, !dob, !gender, !password, !repeatPassword) {
        res.render("register.ejs", {
            error: "Please fill in all fields",
        })
    }
    console.log("this code has run");

    const existingUser = await User.findOne({ where: { email } })
    let passwordValid;
    if (existingUser) {
        res.render("register.ejs", {
            error: "Email already registered",
        })
    } else if (password !== repeatPassword) {
        res.render("register.ejs", {
            error: "Passwords do not match!",
        })
    } else {
        let upper, lower, special, alphabetical = false;
        var i = 0;
        while (i <= password.length) {
            character = password.charAt(i);
            if (isNaN(character * 1)) {
                alphabetical = true;
                if (character == character.toUpperCase()) {
                    upper = true;
                }
                if (character == character.toLowerCase()) {
                    lower = true;
                }
            }
            i++;
        }
        let specials = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (specials.test(password)) {
            special = true;
        }
        if (password.length >= 8 && upper == true && lower == true && special == true && alphabetical == true) {
            passwordValid = true;
        } else {
            res.render("register.ejs", {
                error: "Passwords must contain 8 letters, one uppercase and lowercase letter, and one special character",
            })
        }
    }
    if (passwordValid) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            dob,
            gender,
            password: hashedPassword
        });
        if (newUser) {
            res.redirect("/login");
        }
    }
}

const createClass = (req, res) => {
    if (req.session.authenticate) {
        res.render("class/create.ejs", { loggedIn: true });
    } else {
        res.redirect("/");
    }
}

const createClassRequest = async (req, res) => {
    const { className } = req.body;
    if (!className) {
        res.render("class/create.js", {
            error: "Please input the name of the class"
        })
    } else {
        console.log(userVar.id)
        const newClass = await Classes.create({
            createdBy: req.session.name,
            userId: userVar.id,
            className,

        })
        if (newClass) {
            res.redirect("/")
        }
    }
}
const classPage = async (req, res) => {
    const { id } = req.params;
    if (req.session.authenticate) {
        res.render("class/page.ejs", {
            loggedIn: true,
            class: await Classes.findOne(
                {
                    where: { id },
                    include: Students
                }),
            name: req.session.name
        });
        classVar = await Classes.findOne(
            {
                where: { id },
                include: Students
            })
    } else {
        res.redirect("/");
    }
}

const studentRemoveRequest = async (req, res) => {
    const { id } = req.params;
    const removal = await Students.destroy({
        where: { id }
    })
    if (removal) {
        res.redirect(`/class/pageAccess/${classVar.id}`)
    }
}
const studentCreatePage = (req, res) => {
    if (req.session.authenticate) {
        res.render("class/student/create.ejs")
    } else res.redirect("/")
}

const studentCreateRequest = async (req, res) => {
    const { studentName, studentGender } = req.body
    if (req.session.authenticate) {
        if (!studentName, !studentGender) {
            res.render("class/student/create.ejs", {
                error: "Please fill in all fields"
            })
        } else {
            const newStudent = await Students.create({
                studentName,
                studentGender,
                classId: classVar.id
            })
            if (newStudent) {
                res.redirect(`/class/pageAccess/${classVar.id}`)
            }
        }
    } else res.redirect("/")
}

const classEditPage = (req, res) =>{
    if (req.session.authenticate) {
        res.render("class/edit.ejs", {class: classVar})
    } else res.redirect("/")
}

const classEditRequest = async (req, res) => {
    const { className } = req.body
    if (!className) { res.render("class/edit.ejs", { error: "Please fill in all fields" }) } else {
        const classUpdate = await Classes.update(
            {
                className,
                updatedAt: new Date()
            },
            {
                where: { id: classVar.id }
            }
        )
        console.log(classUpdate)
        if (classUpdate) {
            res.redirect(`/class/pageAccess/${classVar.id}`)
        }
    }
}

const logout = (req, res) => {
    req.session.authenticate = false;
    req.session.name = null
    req.session.id = null
    userVar = null
    classVar = null
    res.redirect("/")
} 

const profilePage = (req, res) => {
    res.render("profile.ejs", {
        name: req.session.name,
        user: userVar
    })
}

const profileEditPage = (req, res) => {
    res.render("profileEdit.ejs", {
        name: req.session.name,
        user: userVar
    })
}

const profileEditRequest = async (req, res) =>{
    const {firstName, lastName, email, dob} = req.body
    if(!firstName, !lastName, !email, !dob){
        res.render("profileEdit.ejs", {
            name: req.session.name,
            user: userVar,
            error: "Please fill in all fields"
        })
    } else {
        const userUpdate = await User.update(
            {
                firstName,
                lastName,
                email,
                dob,
                updatedAt: new Date()
            },
            {
                where: {id: userVar.id}
            }
        )
        if(userUpdate){
            userVar = await User.findOne({
                where: {id: userVar.id},
                include: Classes
            })
            req.session.name = userVar.firstName + " " + userVar.lastName;
            res.redirect("/profile")
        }
    }
}

const profilePasswordPage = (req, res) => {
    if (req.session.authenticate) {
        res.render("passwordEdit.ejs")
    } else res.redirect("/")
}

const profilePasswordRequest = async (req, res) => {
    const {oldPassword, password, repeatPassword} = req.body
    if(!oldPassword, !password, !repeatPassword){
        res.render("passwordEdit.ejs", {
            error: "Please fill in all fields"
        })
    } else {
        const isPassValid = bcrypt.compare(oldPassword, userVar.password)
        if(!isPassValid){
            res.render("passwordEdit.ejs", {
                error: "Old password is incorrect!"
            }) 
        } else {
            if(password == repeatPassword){
                const hashedPassword = await bcrypt.hash(password, 10)
                const passwordUpdate = await User.update(
                    {
                        password: hashedPassword
                    },
                    {
                        where: {id: userVar.id}
                    }
                )
                if(passwordUpdate){
                    res.redirect("/profile")
                }
            }
        }
    }
}

const aboutPage = (req, res) => {
    res.render("about.ejs", {
        isLoggedIn: req.session.authenticate,
        name: req.session.name
    })
}
module.exports = {
    Home,
    loginPage,
    loginRequest,
    registerPage,
    registerRequest,
    createClass,
    createClassRequest,
    classPage,
    studentRemoveRequest,
    studentCreatePage,
    studentCreateRequest,
    classEditPage,
    classEditRequest,
    logout,
    profilePage,
    profileEditPage,
    profileEditRequest,
    profilePasswordPage,
    profilePasswordRequest,
    aboutPage
}