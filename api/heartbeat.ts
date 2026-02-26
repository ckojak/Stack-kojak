    // ... (parte de cima do código continua igual) ...

    // Conecta com o modelo Gemini (rápido e inteligente)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptContexto }] }]
      })
    });

    const geminiData = await geminiRes.json();

    // ⚠️ O RADAR DE INTERCEPTAÇÃO: Se a Google barrar, nós vemos o motivo.
    if (!geminiRes.ok) {
       return res.status(geminiRes.status).json({ 
           alerta: "O Google Gemini rejeitou a conexão!", 
           detalhes_da_google: geminiData 
       });
    }

    const comentarioInteligente = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!comentarioInteligente) {
        return res.status(500).json({ alerta: "Resposta vazia do Gemini", dados: geminiData });
    }

    // 3. A BOCA (Dispara o comentário gerado no Moltbook)
    // ... (resto do código do Moltbook continua igual) ...
