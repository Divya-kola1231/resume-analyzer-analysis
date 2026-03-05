skills_list = [
    "python",
    "react",
    "django",
    "mysql",
    "javascript",
    "html",
    "css",
    "docker",
    "aws",
    "git"
]

def extract_skills(text):

    text = text.lower()

    found_skills = []

    for skill in skills_list:
        if skill in text:
            found_skills.append(skill)

    return found_skills