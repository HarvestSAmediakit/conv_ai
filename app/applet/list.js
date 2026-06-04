const apiKey = "AIzaSyAe07lVyd2JlwIcpE0ZojOaD7O3VR5JCfI";
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
  .then(r => r.json())
  .then(d => {
    if(!d.models) {
      console.log(d);
      return;
    }
    const bidi = d.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("bidiGenerateContent"));
    console.log(JSON.stringify(bidi.map(m => m.name)));
  });
