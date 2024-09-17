// components/IconButton.tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

type IconButtonProps = {
    icon: IconProp;
    className: string;
    onClick: () => void;
};

const IconButton: React.FC<IconButtonProps> = ({ icon, className, onClick }) => {
    return (
        <button
            className="icon-button"
            onClick={onClick}
        >
            <FontAwesomeIcon icon={icon} className={className} />
        </button>
    );
};

export default IconButton;