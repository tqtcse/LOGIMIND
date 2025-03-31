import ModeSwitcher from './ModeSwitcher'
import LayoutSwitcher from './LayoutSwitcher'
import ThemeSwitcher from './ThemeSwitcher'
import DirectionSwitcher from './DirectionSwitcher'
import CopyButton from './CopyButton'

export type ThemeConfiguratorProps = {
    callBackClose?: () => void
}

const ThemeConfigurator = ({ callBackClose }: ThemeConfiguratorProps) => {
    return (
        <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col gap-y-10 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h6>Chế độ tối</h6>
                        <span>Chuyển sang chế độ bóng tối</span>
                    </div>
                    <ModeSwitcher />
                </div>
            
            
            </div>
            {/* <CopyButton /> */}
        </div>
    )
}

export default ThemeConfigurator
