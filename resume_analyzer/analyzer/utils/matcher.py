def match_skills(resume_skills, jd_skills):

    matched = set(resume_skills) & set(jd_skills)

    missing = set(jd_skills) - set(resume_skills)

    score = (len(matched) / len(jd_skills)) * 100 if jd_skills else 0

    return score, list(missing)