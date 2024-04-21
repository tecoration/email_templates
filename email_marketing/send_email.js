require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const readline = require('readline');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail() {
    try {
        const data = JSON.parse(fs.readFileSync(process.env.PLACEHOLDER_DATA_FILE_PATH, 'utf-8'));

        Object.values(data).forEach(async (entry) => {
            const msg = {
                to: entry.to,
                from: process.env.FROM_EMAIL,
                templateId: process.env.TEMPLATE_ID,
                dynamicTemplateData: entry,
            };
    
            await sgMail.send(msg);
            console.log('Email sent successfully!', entry.company_name);
        });

        
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Do you want to send the emails? Type "Yes" to confirm: ', (answer) => {
    if (answer.toLowerCase() === 'yes') {
        sendEmail();
    } else {
        console.log('Email sending aborted.');
    }
    rl.close();
});
