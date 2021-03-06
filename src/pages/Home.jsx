import React from 'react';
import { Categories, PizzaBlock, PizzaLoadingBlock, SortPopup } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory, setSortBy } from '../redux/actions/filters';
import { fetchPizzas } from '../redux/actions/pizzas';
import { addPizzaToCart } from '../redux/actions/cart';

const sortItems = [
  { name: 'популярности', type: 'popular', order: 'desc' },
  { name: 'цене', type: 'price', order: 'desc' },
  { name: 'алфавиту', type: 'name', order: 'asc' },
];

const categoryItems = ['Мясные', 'Вегетарианская', 'Гриль', 'Острые', 'Закрытые'];

const Home = () => {
  const items = useSelector(({ pizzas }) => pizzas.items);
  const cartItems = useSelector(({ cart }) => cart.items);
  const isLoaded = useSelector(({ pizzas }) => pizzas.isLoaded);
  const { category, sortBy } = useSelector(({ filters }) => filters);
  const dispatch = useDispatch();

  console.log(cartItems)

  const onSelectCategory = React.useCallback(
    (category) => dispatch(setCategory(category)),
    [dispatch],
  );
  const onSelectSortType = React.useCallback(
    (sortType) => dispatch(setSortBy(sortType)),
    [dispatch],
  );

  const handleAddPizzaToCart = (obj) => {
    dispatch(addPizzaToCart(obj));
  };

  React.useEffect(() => {
    dispatch(fetchPizzas(sortBy, category));
  }, [category, sortBy, dispatch]);

  return (
    <div className="container">
      <div className="content__top">
        <Categories
          activeCategory={category}
          onClickCategory={onSelectCategory}
          items={categoryItems}
        />
        <SortPopup
          onClickSortType={onSelectSortType}
          activeSortType={sortBy.type}
          items={sortItems}
        />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {isLoaded
          ? items.map((obj) => (
              <PizzaBlock addedCount={cartItems[obj.id] && cartItems[obj.id].length} onClickAddPizza={handleAddPizzaToCart} key={obj.id} {...obj} />
            ))
          : Array(12)
              .fill(0)
              .map((_, index) => <PizzaLoadingBlock key={index} />)}
      </div>
    </div>
  );
};

export default Home;
