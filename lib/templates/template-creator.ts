const createEmailTemplate = ({
  blogTitle,
  blogDescription,
  blogThumbnail,
}: {
  blogTitle: string
  blogDescription: string
  blogThumbnail: string
}) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Blog on Hivemind</title>
    <style>
      body, p, h1, h2, h3, h4, h5, h6 {
        margin: 0;
        padding: 0;
      }
      body {
        font-family: "Arial", sans-serif;
        line-height: 1.6;
      }
      h1 {
        font-size: 24px;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
      }
      .email-content {
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 5px;
      }
      p {
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-content">
        <h1>${blogTitle}</h1>
        <p>${blogDescription}</p>
      </div>
    </div>
  </body>
</html>
`

export { createEmailTemplate }
