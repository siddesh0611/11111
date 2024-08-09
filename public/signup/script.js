async function handleSignUp(event) {
    event.preventDefault();
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = '';
    try {
        const userName = document.getElementById('userName').value;
        const emailId = document.getElementById('emailId').value;
        const password = document.getElementById('password').value;

        const userDetails = {
            userName: userName,
            emailId: emailId,
            password: password
        };
        console.log(userDetails);

        await axios.post('http://localhost:3000/user/signup', userDetails)
            .then(response => {
                console.log('User details sent successfully');
                document.getElementById('userName').value = '';
                document.getElementById('emailId').value = '';
                document.getElementById('password').value = '';
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
