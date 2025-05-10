import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbAlertTriangle, TbBell, TbX, TbBellRinging } from 'react-icons/tb';

function WeatherAlerts({ alerts, location }) {
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(
        localStorage.getItem('weatherNotifications') === 'true'
    );

    const handleNotificationToggle = () => {
        if (!notificationsEnabled) {
            if ('Notification' in window) {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        setNotificationsEnabled(true);
                        localStorage.setItem('weatherNotifications', 'true');
                        // Show test notification
                        new Notification('Weather Notifications Enabled', {
                            body: `You'll be notified about important weather updates for ${location?.name || 'your location'}.`,
                            icon: '/icon.png'
                        });
                    }
                });
            }
        } else {
            setNotificationsEnabled(false);
            localStorage.setItem('weatherNotifications', 'false');
        }
    };

    useEffect(() => {
        // Check if there are severe alerts and notifications are enabled
        if (alerts?.length > 0 && notificationsEnabled && 'Notification' in window) {
            const severeAlerts = alerts.filter(alert => alert.severity === 'severe' || alert.severity === 'extreme');

            if (severeAlerts.length > 0) {
                severeAlerts.forEach(alert => {
                    new Notification(`Weather Alert: ${alert.event}`, {
                        body: alert.desc,
                        icon: '/icon.png'
                    });
                });
            }
        }
    }, [alerts, notificationsEnabled]);

    if (!alerts || alerts.length === 0) {
        return (
            <div className="flex justify-end">
                <button
                    onClick={() => setShowNotificationModal(true)}
                    className="flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors"
                >
                    {notificationsEnabled ? <TbBellRinging /> : <TbBell />}
                    <span>{notificationsEnabled ? 'Notifications on' : 'Enable notifications'}</span>
                </button>

                <NotificationModal
                    isOpen={showNotificationModal}
                    onClose={() => setShowNotificationModal(false)}
                    onToggle={handleNotificationToggle}
                    enabled={notificationsEnabled}
                    location={location}
                />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
        >
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold flex items-center gap-2 text-red-300">
                    <TbAlertTriangle /> Weather Alerts
                </h2>
                <button
                    onClick={() => setShowNotificationModal(true)}
                    className="flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors"
                >
                    {notificationsEnabled ? <TbBellRinging /> : <TbBell />}
                    <span>{notificationsEnabled ? 'Notifications on' : 'Get notified'}</span>
                </button>
            </div>

            <div className="space-y-3">
                {alerts.map((alert, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="backdrop-blur-md bg-red-500/20 border border-red-500/30 rounded-xl p-4"
                    >
                        <h3 className="font-semibold text-red-200">{alert.event}</h3>
                        <p className="text-sm text-red-100 mt-1">{alert.desc}</p>
                        <div className="mt-2 flex justify-between text-xs text-red-200/70">
                            <span>Effective: {new Date(alert.effective).toLocaleString()}</span>
                            <span>Expires: {new Date(alert.expires).toLocaleString()}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <NotificationModal
                isOpen={showNotificationModal}
                onClose={() => setShowNotificationModal(false)}
                onToggle={handleNotificationToggle}
                enabled={notificationsEnabled}
                location={location}
            />
        </motion.div>
    );
}

function NotificationModal({ isOpen, onClose, onToggle, enabled, location }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-6 max-w-md w-full relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-white"
                        >
                            <TbX size={20} />
                        </button>

                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <TbBell size={32} className="text-blue-300" />
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-center mb-2">Weather Notifications</h3>
                        <p className="text-blue-200 text-center mb-6">
                            Get notifications for severe weather alerts and significant changes in
                            {location?.name ? ` ${location.name}` : ' your location'}.
                        </p>

                        <div className="flex justify-center mb-6">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={enabled}
                                    onChange={onToggle}
                                    className="sr-only peer"
                                />
                                <div className="relative w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ms-3 text-sm font-medium text-white">
                                    {enabled ? 'Notifications enabled' : 'Enable notifications'}
                                </span>
                            </label>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                        >
                            Done
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default WeatherAlerts;