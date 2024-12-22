import { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  IconButton,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlus, FaSave, FaUndo, FaRedo, FaDesktop, FaTabletAlt, FaMobileAlt } from 'react-icons/fa';

const WebsiteBuilder = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [viewportSize, setViewportSize] = useState('desktop');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const dispatch = useDispatch();
  
  const elements = useSelector(state => state.builder.elements);
  const template = useSelector(state => state.builder.template);

  const handleDrop = useCallback((item, monitor) => {
    const delta = monitor.getDifferenceFromInitialOffset();
    const left = Math.round(item.left + delta.x);
    const top = Math.round(item.top + delta.y);
    
    dispatch({
      type: 'MOVE_ELEMENT',
      payload: {
        id: item.id,
        left,
        top
      }
    });
    
    addToHistory();
  }, []);

  const addToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(elements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      dispatch({
        type: 'SET_ELEMENTS',
        payload: history[historyIndex - 1]
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      dispatch({
        type: 'SET_ELEMENTS',
        payload: history[historyIndex + 1]
      });
    }
  };

  const saveWebsite = async () => {
    try {
      // API call to save website
      toast({
        title: 'Website saved successfully',
        status: 'success',
        duration: 3000
      });
    } catch (error) {
      toast({
        title: 'Error saving website',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="lg">Website Builder</Heading>
          <Flex gap={2}>
            <IconButton
              icon={<FaUndo />}
              onClick={undo}
              isDisabled={historyIndex <= 0}
              aria-label="Undo"
            />
            <IconButton
              icon={<FaRedo />}
              onClick={redo} 
              isDisabled={historyIndex >= history.length - 1}
              aria-label="Redo"
            />
            <IconButton
              icon={<FaDesktop />}
              onClick={() => setViewportSize('desktop')}
              isActive={viewportSize === 'desktop'}
              aria-label="Desktop view"
            />
            <IconButton
              icon={<FaTabletAlt />}
              onClick={() => setViewportSize('tablet')}
              isActive={viewportSize === 'tablet'}
              aria-label="Tablet view"
            />
            <IconButton
              icon={<FaMobileAlt />}
              onClick={() => setViewportSize('mobile')}
              isActive={viewportSize === 'mobile'}
              aria-label="Mobile view"
            />
            <Button leftIcon={<FaSave />} colorScheme="blue" onClick={saveWebsite}>
              Save
            </Button>
          </Flex>
        </Flex>

        <Grid templateColumns="200px 1fr" gap={4}>
          <Box bg="gray.100" p={4} borderRadius="md">
            <Heading size="sm" mb={4}>Elements</Heading>
            <Flex direction="column" gap={2}>
              <Button leftIcon={<FaPlus />} onClick={() => onOpen()}>
                Add Element
              </Button>
            </Flex>
          </Box>

          <Box
            bg="white"
            p={4}
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
            h="calc(100vh - 200px)"
            overflow="auto"
            className={`viewport-${viewportSize}`}
          >
            {elements.map(element => (
              <DraggableElement
                key={element.id}
                element={element}
                isSelected={selectedElement?.id === element.id}
                onClick={() => setSelectedElement(element)}
                onDrop={handleDrop}
              />
            ))}
          </Box>
        </Grid>
      </Container>
    </DndProvider>
  );
};

const DraggableElement = ({ element, isSelected, onClick, onDrop }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'element',
    item: { id: element.id, left: element.left, top: element.top },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <Box
      ref={drag}
      position="absolute"
      left={element.left}
      top={element.top}
      cursor="move"
      opacity={isDragging ? 0.5 : 1}
      border={isSelected ? '2px solid blue' : 'none'}
      onClick={onClick}
    >
      {element.content}
    </Box>
  );
};

export default WebsiteBuilder;