'use client';

import { useState } from 'react';
import ImagePickerModal from './ImagePickerModal';

const IMAGE_KEYS = new Set(['src', 'image', 'cover', 'poster', 'thumb', 'thumbnail']);

function blankLike(sample) {
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === 'object') {
    const out = {};
    for (const k of Object.keys(sample)) out[k] = blankLike(sample[k]);
    return out;
  }
  if (typeof sample === 'number') return 0;
  if (typeof sample === 'boolean') return false;
  return '';
}

function clone(v) {
  return typeof structuredClone === 'function'
    ? structuredClone(v)
    : JSON.parse(JSON.stringify(v));
}

// Immutable set at a path like ['0', 'gallery', '2', 'alt'].
function setAt(root, path, value) {
  const next = clone(root);
  let node = next;
  for (let i = 0; i < path.length - 1; i += 1) node = node[path[i]];
  node[path[path.length - 1]] = value;
  return next;
}

function mutateArrayAt(root, path, fn) {
  const next = clone(root);
  let node = next;
  for (let i = 0; i < path.length - 1; i += 1) node = node[path[i]];
  fn(node[path[path.length - 1]]);
  return next;
}

function Field({ label, path, value, onChange, onPick }) {
  const key = path[path.length - 1];
  const id = path.join('.');

  // Primitive: string / number / boolean
  if (value === null || typeof value !== 'object') {
    if (typeof value === 'boolean') {
      return (
        <label className="admin-field admin-field-inline">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(path, e.target.checked)}
          />
          {label}
        </label>
      );
    }

    const isImage = IMAGE_KEYS.has(String(key));
    const str = value == null ? '' : String(value);
    const long = str.length > 70 || str.includes('\n');

    return (
      <div className="admin-field">
        <label htmlFor={id}>{label}</label>
        <div className="admin-field-row">
          {long ? (
            <textarea
              id={id}
              value={str}
              rows={3}
              onChange={(e) => onChange(path, e.target.value)}
            />
          ) : (
            <input
              id={id}
              type={typeof value === 'number' ? 'number' : 'text'}
              value={str}
              onChange={(e) =>
                onChange(
                  path,
                  typeof value === 'number' ? Number(e.target.value) : e.target.value
                )
              }
            />
          )}
          {isImage && (
            <button type="button" className="admin-mini" onClick={() => onPick(path)}>
              Pick
            </button>
          )}
        </div>
        {isImage && str && (
          <img className="admin-field-preview" src={str} alt="" loading="lazy" />
        )}
      </div>
    );
  }

  // Array
  if (Array.isArray(value)) {
    const sample = value[0];
    const primitiveItems = value.length === 0 || typeof sample !== 'object' || sample === null;

    return (
      <div className="admin-group">
        <div className="admin-group-head">
          <span>{label}</span>
          <button
            type="button"
            className="admin-mini"
            onClick={() =>
              onChange(path, [
                ...value,
                value.length ? blankLike(sample) : '',
              ])
            }
          >
            + Add
          </button>
        </div>

        {value.map((item, i) => (
          <div className="admin-array-item" key={i}>
            <div className="admin-array-controls">
              <button
                type="button"
                className="admin-mini"
                disabled={i === 0}
                onClick={() =>
                  onChange(
                    path,
                    (() => {
                      const a = [...value];
                      [a[i - 1], a[i]] = [a[i], a[i - 1]];
                      return a;
                    })()
                  )
                }
                aria-label="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                className="admin-mini"
                disabled={i === value.length - 1}
                onClick={() =>
                  onChange(
                    path,
                    (() => {
                      const a = [...value];
                      [a[i + 1], a[i]] = [a[i], a[i + 1]];
                      return a;
                    })()
                  )
                }
                aria-label="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                className="admin-mini admin-mini-danger"
                onClick={() => onChange(path, value.filter((_, j) => j !== i))}
                aria-label="Remove"
              >
                ✕
              </button>
            </div>

            {primitiveItems ? (
              <Field
                label={`${i + 1}`}
                path={[...path, String(i)]}
                value={item}
                onChange={onChange}
                onPick={onPick}
              />
            ) : (
              <div className="admin-array-fields">
                {Object.keys(item).map((k) => (
                  <Field
                    key={k}
                    label={k}
                    path={[...path, String(i), k]}
                    value={item[k]}
                    onChange={onChange}
                    onPick={onPick}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Plain object
  return (
    <div className="admin-group">
      <div className="admin-group-head">
        <span>{label}</span>
      </div>
      {Object.keys(value).map((k) => (
        <Field
          key={k}
          label={k}
          path={[...path, k]}
          value={value[k]}
          onChange={onChange}
          onPick={onPick}
        />
      ))}
    </div>
  );
}

// A page's own copy (home/about/contact/...) is a plain object, not a list —
// render its fields directly instead of the "list of entries" UI below.
function ObjectForm({ value, onChange }) {
  const [pickerPath, setPickerPath] = useState(null);

  function handleChange(path, newValue) {
    onChange(setAt(value, path, newValue));
  }

  return (
    <div className="admin-structured admin-structured-flat">
      {Object.keys(value).map((k) => (
        <Field
          key={k}
          label={k}
          path={[k]}
          value={value[k]}
          onChange={handleChange}
          onPick={setPickerPath}
        />
      ))}
      <ImagePickerModal
        open={pickerPath !== null}
        onClose={() => setPickerPath(null)}
        onPick={(url) => {
          handleChange(pickerPath, url);
          setPickerPath(null);
        }}
      />
    </div>
  );
}

export default function StructuredEditor({ value, onChange }) {
  const [pickerPath, setPickerPath] = useState(null);

  if (!Array.isArray(value)) {
    if (value && typeof value === 'object') {
      return <ObjectForm value={value} onChange={onChange} />;
    }
    return (
      <p className="admin-json-error">
        This section can only be edited in the Raw JSON tab.
      </p>
    );
  }

  function handleChange(path, newValue) {
    onChange(setAt(value, path, newValue));
  }

  return (
    <div className="admin-structured">
      {value.map((entry, i) => (
        <details className="admin-entry" key={i} open={value.length <= 3}>
          <summary>
            {entry.title || entry.name || entry.eyebrow || `Item ${i + 1}`}
          </summary>
          <div className="admin-entry-body">
            <div className="admin-array-controls admin-array-controls-top">
              <button
                type="button"
                className="admin-mini"
                disabled={i === 0}
                onClick={() =>
                  onChange(
                    (() => {
                      const a = [...value];
                      [a[i - 1], a[i]] = [a[i], a[i - 1]];
                      return a;
                    })()
                  )
                }
              >
                ↑ Move up
              </button>
              <button
                type="button"
                className="admin-mini"
                disabled={i === value.length - 1}
                onClick={() =>
                  onChange(
                    (() => {
                      const a = [...value];
                      [a[i + 1], a[i]] = [a[i], a[i + 1]];
                      return a;
                    })()
                  )
                }
              >
                ↓ Move down
              </button>
              <button
                type="button"
                className="admin-mini admin-mini-danger"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
              >
                ✕ Delete this entry
              </button>
            </div>

            {Object.keys(entry).map((k) => (
              <Field
                key={k}
                label={k}
                path={[String(i), k]}
                value={entry[k]}
                onChange={handleChange}
                onPick={setPickerPath}
              />
            ))}
          </div>
        </details>
      ))}

      <button
        type="button"
        className="admin-mini"
        onClick={() =>
          onChange([...value, value.length ? blankLike(value[0]) : {}])
        }
      >
        + Add entry
      </button>

      <ImagePickerModal
        open={pickerPath !== null}
        onClose={() => setPickerPath(null)}
        onPick={(url) => {
          handleChange(pickerPath, url);
          setPickerPath(null);
        }}
      />
    </div>
  );
}
