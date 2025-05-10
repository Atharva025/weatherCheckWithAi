import { motion } from 'framer-motion';
import { TbAlertTriangle } from 'react-icons/tb';

function ErrorMessage({ message }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 backdrop-blur-md rounded-xl p-6 border border-red-500/30 text-center max-w-xl mx-auto"
        >
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-500/30 flex items-center justify-center">
                    <TbAlertTriangle className="text-3xl text-red-300" />
                </div>
            </div>
            <h3 className="text-xl font-bold text-red-300 mb-2">Error</h3>
            <p className="text-red-100">{message}</p>
            <p className="mt-4 text-sm text-red-200/70">
                Please check your internet connection or try searching for another location.
            </p>
        </motion.div>
    );
}

export default ErrorMessage;