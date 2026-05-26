import { DataFromGlobalSlug } from "payload";

export const Header: React.FC<{ headerProps: DataFromGlobalSlug<'header'> }> = () => {
    return <div className='max-w-2xl mx-auto p-4'></div>
}