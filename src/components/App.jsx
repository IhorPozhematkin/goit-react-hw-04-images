import { useState, useEffect } from 'react';
import { serviceSearch } from 'helpers/pixabay-api';
import { Button } from './Button/Button';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { Searchbar } from './Searchbar/Searchbar';
import { Wrapper, Error } from './App.styled';

export function App() {
  const [request, setRequest] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [currentItem, setCurrentItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMore, setIsLoadMore] = useState(false);

  useEffect(() => {
    if (!request) {
      return;
    }
    setIsLoading(true);

    serviceSearch(request, page)
      .then(({ hits, totalHits }) => {
        if (!hits.length) {
          setError('Please try again.');
          return;
        }
        setImages(state => [...state, ...hits]);
        setIsLoadMore(page < Math.ceil(totalHits / 12));
        setError('');
      })
      .catch(() => setError('Please try again.'))
      .finally(() => setIsLoading(false));
  }, [page, request]);

  const searchHandler = obj => {
    if (obj.searchrequest.trim() === '') {
      setError('Please, enter request');
      return;
    }
    setRequest(obj.searchrequest);
    setPage(1);
    setImages([]);
    setIsLoadMore(false);
    setError('');
  };

  const loadMoreHandler = () => {
    setPage(state => state + 1);
  };

  const openModalHandler = e => {
    const imageId = Number(e.target.id);
    const currentItem = images.find(({ id }) => id === imageId);
    setCurrentItem(currentItem);
  };

  const closeModalHandler = () => {
    setCurrentItem(null);
  };

  return (
    <Wrapper>
      <Searchbar searchHandler={searchHandler} />
      {error === '' ? (
        <ImageGallery items={images} openModalHandler={openModalHandler} />
      ) : (
        <Error>{error}</Error>
      )}
      {isLoading && <Loader />}
      {isLoadMore && <Button onClick={loadMoreHandler} />}
      {currentItem && (
        <Modal item={currentItem} closeModal={closeModalHandler} />
      )}
    </Wrapper>
  );
}
