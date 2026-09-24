import { Modal } from 'flowbite-react';
import UiButton from './UiButton';

/**
 * نافذة منبثقة Flowbite — بديل <div class="modal hidden"> الأصلي.
 */
export default function UiModal({ open, onClose, title, icon, children, footer, size = 'md' }) {
    return (
        <Modal dismissible show={open} onClose={onClose} size={size} popup={false}>
            <Modal.Header className="border-b border-slate-100 !p-4">
                <div className="flex items-center gap-2.5">
                    {icon && <i className={`ti ${icon} text-lg text-[#006C35]`}></i>}
                    <span className="text-[15px] font-extrabold text-slate-900">{title}</span>
                </div>
            </Modal.Header>
            <Modal.Body className="!p-5">{children}</Modal.Body>
            {footer && (
                <Modal.Footer className="!p-4 border-t border-slate-100 flex justify-end gap-2">
                    {footer}
                </Modal.Footer>
            )}
        </Modal>
    );
}