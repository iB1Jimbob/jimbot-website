function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function highlight(text, regex) {
    for (const key in regex) {
        text = text.replace(regex[key], match => {
            const elem = document.createElement('span');
            elem.classList.add(key);
            elem.innerText = match;
            return elem.outerHTML;
        });
    }
    return text;
}

function feedback(text, type) {
    const newSpan = document.createElement('span');
    newSpan.classList.add(type);
    newSpan.innerText = text;
    document.querySelector('#contact .content .feedback').appendChild(newSpan);
}


window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.content');

    for (const element of elements) {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 150;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    }
});


fetch('http://127.0.0.1:5000/info', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => response.json()).then(data => {
    animateValue(document.querySelector('.stats .stat .serverCount'), 0, data.guilds, 1000);
    animateValue(document.querySelector('.stats .stat .channelCount'), 0, data.channels, 1000);
    animateValue(document.querySelector('.stats .stat .userCount'), 0, data.users, 1000);
});

fetch('http://127.0.0.1:5000/commands', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => response.json()).then(data => {
    const commands = document.querySelector('#commands .content .commands');
    for (const command of data) {
        const commandElement = document.createElement('details');
        commandElement.classList.add('command');
        const summary = document.createElement('summary');
        summary.innerHTML = command.name;
        summary.classList.add('no-select');
        commandElement.appendChild(summary);

        commandElement.innerHTML += `
            <p>Description: <span class="description">${command.description}</span></p>
            <p>Usage: <span class="usage">${highlight(command.usage, {req: /<[^>]+>/g, opt: /\[[^>]+]/g, cmd: /[a-z]+?![a-z]+/g})}</span></p>
            <p>Aliases: <span class="aliases">${command.aliases.join(', ') || 'none'}</span></p>
        `

        commands.appendChild(commandElement);
    }
});

document.querySelector('#contact .content button').addEventListener('click', () => {
    const name = document.querySelector('#contact .content input#name').value;
    const email = document.querySelector('#contact .content input#email').value;
    const message = document.querySelector('#contact .content textarea#message').value;

    if (!name) {
        feedback('Please enter your name', 'error');
        document.querySelector('#contact .content input#name').style.borderColor = 'red';
        return;
    }
    if (!email) {
        feedback('Please enter your email', 'error');
        document.querySelector('#contact .content input#email').style.borderColor = 'red';
        return;
    }
    if (!message) {
        feedback('Please enter a message', 'error');
        document.querySelector('#contact .content textarea#message').style.borderColor = 'red';
        return;
    }
});