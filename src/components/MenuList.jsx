import MenuItemCard from './MenuItemCard.jsx';

function MenuList({ items, onAdd }) {
    if (items.length === 0) {
        return <p className="muted">No items available.</p>;
    }

    return (
        <div className="grid">
            {items.map((item) => (
                <MenuItemCard key={item.id} item={item} onAdd={onAdd} />
            ))}
        </div>
    );
}

export default MenuList;