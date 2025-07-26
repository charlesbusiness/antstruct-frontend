export const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

export const PasswordRegexMessage = "Password must have at least one uppercase, one lowercase, one number, and one special character"

export const LeaveType = {
    SICK: 'sick leave',
    CASUAL: 'casual leave',
    ANNUAL: 'annual leave',
    STUDY: 'study leave',
    EXAM: 'exam leave',
    MATERNITY: 'maternity leave',
    PATERNITY: 'paternity leave',
    COMPASSIONATE: 'compassionate leave',
}
