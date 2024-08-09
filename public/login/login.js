async function handleLogin(event) {
    event.preventDefault();

    try {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = '';

        const emailId = document.getElementById('emailId').value;
        const password = document.getElementById('password').value;

        const userDetails = { emailId, password };

        await axios.post('http://localhost:3000/user/login', userDetails)
            .then(response => {
                console.log('Logged in successfully');
                document.getElementById('emailId').value = '';
                document.getElementById('password').value = '';
                localStorage.setItem('token', response.data.token);
                window.location.href = '../expense/expense.html';
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.message) {
                    console.error(err.response.data.message);
                    messageDiv.textContent = err.response.data.message;
                } else {
                    console.error(err);
                }
            });
    } catch (err) {
        console.log(err);
    }
}
