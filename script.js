const roles = {
    "Data Analytics": [
        {name: "Data Analyst Intern", skills: ["Python", "SQL", "Excel", "Power BI"], desc: "Analyze data, build reports and create business insights."},
        {name: "Business Analytics Intern", skills: ["Excel", "SQL", "Python"], desc: "Work with business data, dashboards and performance metrics."},
        {name: "BI Intern", skills: ["Power BI", "SQL", "Excel"], desc: "Create dashboards and transform data into visual insights."}
    ],
    "AI / ML": [
        {name: "Machine Learning Intern", skills: ["Python", "Machine Learning", "SQL"], desc: "Prepare datasets and build beginner machine-learning solutions."},
        {name: "AI Intern", skills: ["Python", "Machine Learning"], desc: "Work with AI concepts, data and model experiments."},
        {name: "Data Science Intern", skills: ["Python", "SQL", "Machine Learning"], desc: "Explore data and build predictive models."}
    ],
    "Web Development": [
        {name: "Frontend Developer Intern", skills: ["HTML/CSS", "JavaScript"], desc: "Build responsive and interactive web pages."},
        {name: "Web Developer Intern", skills: ["HTML/CSS", "JavaScript", "SQL"], desc: "Develop and maintain simple web applications."},
        {name: "Full Stack Intern", skills: ["HTML/CSS", "JavaScript", "SQL", "Python"], desc: "Work across frontend and backend development."}
    ],
    "Software Development": [
        {name: "Java Developer Intern", skills: ["Java", "SQL"], desc: "Develop and test Java-based software applications."},
        {name: "Software Developer Intern", skills: ["Java", "Python", "SQL"], desc: "Solve programming tasks and contribute to software projects."},
        {name: "Application Developer Intern", skills: ["Java", "SQL", "HTML/CSS"], desc: "Build and maintain application features."}
    ]
};

const allSkills = [
    "Python", "Java", "SQL", "Excel", "Power BI",
    "HTML/CSS", "JavaScript", "Machine Learning"
];

function getSelectedSkills() {
    return [...document.querySelectorAll('input[type="checkbox"]:checked')]
        .map(box => box.value);
}

function calculateMatch(selected, required) {
    if (required.length === 0) return 0;
    const matched = required.filter(skill => selected.includes(skill)).length;
    return Math.round((matched / required.length) * 100);
}

function findInternship() {
    const selected = getSelectedSkills();
    const domain = document.getElementById("domain").value;
    const result = document.getElementById("results");
    const recommendationBox = document.getElementById("recommendations");
    const gapBox = document.getElementById("gapList");

    document.getElementById("overviewSkills").textContent = selected.length;
    document.getElementById("overviewDomain").textContent =
        domain === "Data Analytics" ? "Data" :
        domain === "AI / ML" ? "AI/ML" :
        domain === "Web Development" ? "Web" : "Software";

    const matches = roles[domain].map(role => ({
        ...role,
        match: calculateMatch(selected, role.skills)
    })).sort((a, b) => b.match - a.match);

    const top = matches[0];

    document.getElementById("topMatch").textContent = `${top.match}% match`;
    document.getElementById("resultIntro").textContent =
        selected.length === 0
        ? `Start by selecting your skills. These roles are common for ${domain} internships.`
        : `Based on your ${selected.length} selected skill${selected.length === 1 ? "" : "s"} in ${domain}.`;

    recommendationBox.innerHTML = matches.map((role, index) => `
        <div class="role-card">
            <p class="small-label">${index === 0 ? "BEST MATCH" : "RECOMMENDED"}</p>
            <h3>${role.name}</h3>
            <p>${role.desc}</p>
            <div class="progress"><div style="width:${role.match}%"></div></div>
            <div class="match-text">${role.match}% skill match</div>
            <p><b>Skills:</b> ${role.skills.join(", ")}</p>
        </div>
    `).join("");

    const needed = [];
    matches.forEach(role => {
        role.skills.forEach(skill => {
            if (!selected.includes(skill) && !needed.includes(skill)) {
                needed.push(skill);
            }
        });
    });

    gapBox.innerHTML = needed.length
        ? needed.slice(0, 6).map(skill => `<span class="gap-item">⚠ ${skill}</span>`).join("")
        : `<span class="gap-item">✓ Great! Your selected skills cover the main requirements.</span>`;

    result.classList.remove("hidden");
    result.scrollIntoView({behavior: "smooth"});
}

function updateSkillCount() {
    const count = getSelectedSkills().length;
    document.getElementById("skillCount").textContent =
        `${count} selected`;
    document.getElementById("overviewSkills").textContent = count;
}

function resetApp() {
    document.querySelectorAll('input[type="checkbox"]').forEach(box => box.checked = false);
    document.getElementById("domain").selectedIndex = 0;
    document.getElementById("results").classList.add("hidden");
    updateSkillCount();
    window.scrollTo({top: 0, behavior: "smooth"});
}

document.querySelectorAll('input[type="checkbox"]').forEach(box => {
    box.addEventListener("change", updateSkillCount);
});

document.getElementById("domain").addEventListener("change", function () {
    const value = this.value;
    document.getElementById("overviewDomain").textContent =
        value === "Data Analytics" ? "Data" :
        value === "AI / ML" ? "AI/ML" :
        value === "Web Development" ? "Web" : "Software";
});

updateSkillCount();
