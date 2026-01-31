export interface ValidationErrors{
    [key: string]: string;
}

export const validateEmail = (email: string): string | null => {
    if(!email){
        return "Email is required.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(email)){
        return "Please enter a valid email address.";
    }

    return null;
}

export const validatePassword = (password: string): string | null => {
    if(!password){
        return "Password is required.";
    }
    if(password.length < 8){
        return "Password must be at least 8 characters long.";
    }
    return null;
}

export const validateUsername = (username: string): string | null => {
    if(!username){
        return "Username is required.";
    }
    if(username.length < 3){
        return "Username must be at least 3 characters long.";
    }

    if(username.length > 50){
        return "Username must be at most 50 characters long.";
    }
    return null;
}


export const validateRequired = (value: string, fieldName: string): string | null => {
    if(!value || value.trim() === ''){
        return `${fieldName} is required.`;
    }
    return null;
}
