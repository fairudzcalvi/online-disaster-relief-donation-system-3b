// Secret admin shortcut: Ctrl + Alt + Z
(function () {
    const keys = {};

    document.addEventListener('keydown', e => {
        keys[e.key.toLowerCase()] = true;

        if (keys['control'] && keys['alt'] && keys['z']) {
            Object.keys(keys).forEach(k => delete keys[k]);
            window.location.href = 'admin-pages/admin_logIn.html';
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', e => {
        delete keys[e.key.toLowerCase()];
    });
})();
