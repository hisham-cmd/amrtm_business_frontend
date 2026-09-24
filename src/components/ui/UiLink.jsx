/**
 * رابط خارجي آمن — الغلاف الرسمي لروابط HTTP (سوشيال / tel: / wa.me / docs).
 * يلتزم بأمان روابط خارجية: target=_blank يحمل rel="noopener noreferrer".
 */
export default function UiLink({ href, className = '', children, ...rest }) {
    return (
        <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
            {children}
        </a>
    );
}