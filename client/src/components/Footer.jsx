import React from 'react'

const Footer = () => {
    const year = new Date().getFullYear()
    return (
        <footer>
            &#169; {year} Madhav Dhall
        </footer>
    )
}

export default Footer
