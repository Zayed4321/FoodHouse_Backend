import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    try {
        
        // Here we will make any password entered by the user to be hashed so that any hacker may not take our user data 

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds );
        return hashedPassword;

    } catch (error) {
        console.log(error)
    }
};

export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};