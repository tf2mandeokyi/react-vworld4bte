export function textToClipboard(text: string) {
    if(!navigator.clipboard) {
        let textArea = document.createElement('textarea');
        textArea.value = text;
        
        document.body.appendChild(textArea);
        textArea.focus(); textArea.select();

        try {
            document.execCommand('copy');
        } catch(ignored) {}

        document.body.removeChild(textArea);
    }
    else {
        navigator.clipboard.writeText(text);
    }
}