const confirmScript = (text, redirectLink) => {
    const confirm = `<script>
    const c = confirm("${text}")
    c == true ? window.location.href="${redirectLink}" : window.location.href="${redirectLink}"
    </script>`

    return confirm
}

module.exports = confirmScript