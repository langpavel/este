
import Immutable from 'immutable';

/*****************************************************************************/
const listStyle = {style: 'list-style-type: none; padding: 0; margin: 0 0 0 12px; font-style: normal'};
const immutableNameStyle = {style: 'color: rgb(232,98,0)'};
const keyStyle = {style: 'color: #881391'};
const defaultValueKeyStyle = {style: 'color: #777'};
const alteredValueKeyStyle = {style: 'color: #881391; font-weight: bolder'};
const inlineValuesStyle = {style: 'color: #777; font-style: italic'}
const nullStyle = {style: 'color: #777'};

export default function createFormatters(Immutable) {

  const reference = (object, config) => {
    if (typeof object === 'undefined')
      return ['span', nullStyle, 'undefined'];
    else if (object === 'null')
      return ['span', nullStyle, 'null'];

    return ['object', {object, config}];
  };

  const renderIterableHeader = (iterable, name = 'Iterable') =>
    ['span', ['span', immutableNameStyle, name], ['span', `[${iterable.size}]`]];

  const hasBody = (collection, config) =>
    collection.size > 0 && !(config && config.noPreview);

  const renderIterableBody = (collection, mapper) => {
    const children = collection
      .map(mapper)
      .toList()
      .toJS();
    return [ 'ol', listStyle, ...children ];
  }

  const RecordFormatter = {
    header(record, config) {
      if (!(record instanceof Immutable.Record))
        return null;

      const defaults = record.clear();
      const changed = !Immutable.is(defaults, record);

      if (config && config.noPreview)
        return ['span', changed ? immutableNameStyle : nullStyle,
          record._name || record.constructor.name || 'Record'];

      let inlinePreview;
      if (!changed) {
        inlinePreview = ['span', inlineValuesStyle, '{}'];
      } else {
        const preview = record
          .keySeq()
          .reduce((preview, key) => {
            if (Immutable.is(defaults.get(key), record.get(key)))
              return preview;
            if (preview.length)
              preview.push(', ');

            preview.push(['span', {},
              ['span', keyStyle, key + ': '],
              reference(record.get(key), {noPreview: true})
            ]);
            return preview;
          }, []);
        inlinePreview = ['span', inlineValuesStyle, '{', ...preview, '}'];
      }
      return ['span', {},
        ['span', immutableNameStyle, record._name || record.constructor.name || 'Record'],
        ' ', inlinePreview
      ];
    },
    hasBody,
    body(record) {
      const defaults = record.clear();
      const children = record
        .keySeq()
        .map(key => {
          const style = Immutable.is(defaults.get(key), record.get(key))
            ? defaultValueKeyStyle : alteredValueKeyStyle;
          return [
            'li', {},
              ['span', style, key + ': '],
              reference(record.get(key))
            ]
        }).toJS();
      return [ 'ol', listStyle, ...children ];
    }
  };

  const ListFormatter = {
    header(o) {
      if (!Immutable.List.isList(o))
        return null;
      return renderIterableHeader(o, 'List');
    },
    hasBody,
    body(o) {
      return renderIterableBody(o, (value, key) =>
        ['li', ['span', keyStyle, key + ': '], reference(value)]
      );
    }
  };

  const StackFormatter = {
    header(o) {
      if (!Immutable.Stack.isStack(o))
        return null;
      return renderIterableHeader(o, 'Stack');
    },
    hasBody,
    body(o) {
      return renderIterableBody(o, (value, key) =>
        ['li', ['span', keyStyle, key + ': '], reference(value)]
      );
    }
  };

  const MapFormatter = {
    header(o) {
      if (!Immutable.Map.isMap(o))
        return null;
      return renderIterableHeader(o, 'Map');
    },
    hasBody,
    body(o) {
      return renderIterableBody(o, (value, key) =>
        ['li', {}, '{', reference(key), ' => ', reference(value), '}']
      );
    }
  };

  const OrderedMapFormatter = {
    header(o) {
      if (!Immutable.OrderedMap.isOrderedMap(o))
        return null;
      return renderIterableHeader(o, 'OrderedMap');
    },
    hasBody,
    body(o) {
      return renderIterableBody(o, (value, key) =>
        ['li', {}, '{', reference(key), ' => ', reference(value), '}']
      );
    }
  };

  const SetFormatter = {
    header(o) {
      if (!Immutable.Set.isSet(o))
        return null;
      return renderIterableHeader(o, 'Set');
    },
    hasBody,
    body(o) {
      return renderIterableBody(o, value =>
        ['li', reference(value)]
      );
    }
  };

  const OrderedSetFormatter = {
    header(o) {
      if (!Immutable.OrderedSet.isOrderedSet(o))
        return null;
      return renderIterableHeader(o, 'OrderedSet');
    },
    hasBody,
    body(o) {
      return renderIterableBody(o, value =>
        ['li', reference(value)]
      );
    }
  };

  return {
    RecordFormatter,
    OrderedMapFormatter,
    OrderedSetFormatter,
    ListFormatter,
    MapFormatter,
    SetFormatter,
    StackFormatter
  }
}

/*****************************************************************************/

//import createFormatters from './createFormatters';

// Check for globally defined Immutable and add an install method to it.
if (typeof Immutable !== "undefined") {
  Immutable.installDevTools = install.bind(null, Immutable);
}

// I imagine most people are using Immutable as a CommonJS module though...

let installed = false;
export default function install(Immutable) {
  if (typeof window === "undefined") {
    throw new Error("Can only install immutable-devtools in a browser environment.");
  }

  // Don't install more than once.
  if (installed === true) {
    return;
  }

  window.devtoolsFormatters = window.devtoolsFormatters || [];

  const {
    RecordFormatter,
    OrderedMapFormatter,
    OrderedSetFormatter,
    ListFormatter,
    MapFormatter,
    SetFormatter,
    StackFormatter
  } = createFormatters(Immutable);

  window.devtoolsFormatters.push(
    RecordFormatter,
    OrderedMapFormatter,
    OrderedSetFormatter,
    ListFormatter,
    MapFormatter,
    SetFormatter,
    StackFormatter
  );

  installed = true;
}


/*****************************************************************************/

window.Immutable = Immutable;
Immutable.installDevTools();
