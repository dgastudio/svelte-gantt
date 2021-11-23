var app = (function () {
    'use strict';

    function noop$1() { }
    function assign$1(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location$1(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run$1(fn) {
        return fn();
    }
    function blank_object$1() {
        return Object.create(null);
    }
    function run_all$1(fns) {
        fns.forEach(run$1);
    }
    function is_function$1(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal$1(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store$1(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe$1(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe$1(component, store, callback) {
        component.$$.on_destroy.push(subscribe$1(store, callback));
    }
    function create_slot$1(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context$1(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context$1(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign$1($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes$1(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context$1(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function update_slot$1(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes$1(slot_definition, $$scope, dirty, get_slot_changes_fn);
        update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn);
    }
    function exclude_internal_props$1(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props$1(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function set_store_value$1(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append$1(target, node) {
        target.appendChild(node);
    }
    function insert$1(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach$1(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each$1(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element$1(name) {
        return document.createElement(name);
    }
    function text$1(data) {
        return document.createTextNode(data);
    }
    function space$1() {
        return text$1(' ');
    }
    function empty$1() {
        return text$1('');
    }
    function listen$1(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr$1(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr$1(node, key, attributes[key]);
            }
        }
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children$1(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event$1(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component$1;
    function set_current_component$1(component) {
        current_component$1 = component;
    }
    function get_current_component$1() {
        if (!current_component$1)
            throw new Error('Function called outside component initialization');
        return current_component$1;
    }
    function onMount$1(fn) {
        get_current_component$1().$$.on_mount.push(fn);
    }
    function onDestroy$1(fn) {
        get_current_component$1().$$.on_destroy.push(fn);
    }
    function createEventDispatcher$1() {
        const component = get_current_component$1();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event$1(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext$1(key, context) {
        get_current_component$1().$$.context.set(key, context);
    }
    function getContext$1(key) {
        return get_current_component$1().$$.context.get(key);
    }

    const dirty_components$1 = [];
    const binding_callbacks$1 = [];
    const render_callbacks$1 = [];
    const flush_callbacks$1 = [];
    const resolved_promise$1 = Promise.resolve();
    let update_scheduled$1 = false;
    function schedule_update$1() {
        if (!update_scheduled$1) {
            update_scheduled$1 = true;
            resolved_promise$1.then(flush$1);
        }
    }
    function add_render_callback$1(fn) {
        render_callbacks$1.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks$1.push(fn);
    }
    let flushing$1 = false;
    const seen_callbacks$1 = new Set();
    function flush$1() {
        if (flushing$1)
            return;
        flushing$1 = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components$1.length; i += 1) {
                const component = dirty_components$1[i];
                set_current_component$1(component);
                update$1(component.$$);
            }
            set_current_component$1(null);
            dirty_components$1.length = 0;
            while (binding_callbacks$1.length)
                binding_callbacks$1.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks$1.length; i += 1) {
                const callback = render_callbacks$1[i];
                if (!seen_callbacks$1.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks$1.add(callback);
                    callback();
                }
            }
            render_callbacks$1.length = 0;
        } while (dirty_components$1.length);
        while (flush_callbacks$1.length) {
            flush_callbacks$1.pop()();
        }
        update_scheduled$1 = false;
        flushing$1 = false;
        seen_callbacks$1.clear();
    }
    function update$1($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all$1($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback$1);
        }
    }
    const outroing$1 = new Set();
    let outros$1;
    function group_outros$1() {
        outros$1 = {
            r: 0,
            c: [],
            p: outros$1 // parent group
        };
    }
    function check_outros$1() {
        if (!outros$1.r) {
            run_all$1(outros$1.c);
        }
        outros$1 = outros$1.p;
    }
    function transition_in$1(block, local) {
        if (block && block.i) {
            outroing$1.delete(block);
            block.i(local);
        }
    }
    function transition_out$1(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing$1.has(block))
                return;
            outroing$1.add(block);
            outros$1.c.push(() => {
                outroing$1.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals$1 = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update$1(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object$1(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component$1(block) {
        block && block.c();
    }
    function mount_component$1(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback$1(() => {
                const new_on_destroy = on_mount.map(run$1).filter(is_function$1);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all$1(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback$1);
    }
    function destroy_component$1(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all$1($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty$1(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components$1.push(component);
            schedule_update$1();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component$1;
        set_current_component$1(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object$1(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object$1(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty$1(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all$1($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children$1(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach$1);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in$1(component.$$.fragment);
            mount_component$1(component, options.target, options.anchor, options.customElement);
            flush$1();
        }
        set_current_component$1(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent$1 {
        $destroy() {
            destroy_component$1(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev$1(type, detail) {
        document.dispatchEvent(custom_event$1(type, Object.assign({ version: '3.44.2' }, detail), true));
    }
    function append_dev$1(target, node) {
        dispatch_dev$1('SvelteDOMInsert', { target, node });
        append$1(target, node);
    }
    function insert_dev$1(target, node, anchor) {
        dispatch_dev$1('SvelteDOMInsert', { target, node, anchor });
        insert$1(target, node, anchor);
    }
    function detach_dev$1(node) {
        dispatch_dev$1('SvelteDOMRemove', { node });
        detach$1(node);
    }
    function listen_dev$1(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev$1('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen$1(node, event, handler, options);
        return () => {
            dispatch_dev$1('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev$1(node, attribute, value) {
        attr$1(node, attribute, value);
        if (value == null)
            dispatch_dev$1('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev$1('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev$1(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev$1('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument$1(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots$1(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev$1 extends SvelteComponent$1 {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    function commonjsRequire (target) {
    	throw new Error('Could not dynamically require "' + target + '". Please configure the dynamicRequireTargets option of @rollup/plugin-commonjs appropriately for this require call to behave properly.');
    }

    var moment = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
        module.exports = factory() ;
    }(commonjsGlobal, (function () {
        var hookCallback;

        function hooks() {
            return hookCallback.apply(null, arguments);
        }

        // This is done to register the method called with moment()
        // without creating circular dependencies.
        function setHookCallback(callback) {
            hookCallback = callback;
        }

        function isArray(input) {
            return (
                input instanceof Array ||
                Object.prototype.toString.call(input) === '[object Array]'
            );
        }

        function isObject(input) {
            // IE8 will treat undefined and null as object if it wasn't for
            // input != null
            return (
                input != null &&
                Object.prototype.toString.call(input) === '[object Object]'
            );
        }

        function hasOwnProp(a, b) {
            return Object.prototype.hasOwnProperty.call(a, b);
        }

        function isObjectEmpty(obj) {
            if (Object.getOwnPropertyNames) {
                return Object.getOwnPropertyNames(obj).length === 0;
            } else {
                var k;
                for (k in obj) {
                    if (hasOwnProp(obj, k)) {
                        return false;
                    }
                }
                return true;
            }
        }

        function isUndefined(input) {
            return input === void 0;
        }

        function isNumber(input) {
            return (
                typeof input === 'number' ||
                Object.prototype.toString.call(input) === '[object Number]'
            );
        }

        function isDate(input) {
            return (
                input instanceof Date ||
                Object.prototype.toString.call(input) === '[object Date]'
            );
        }

        function map(arr, fn) {
            var res = [],
                i;
            for (i = 0; i < arr.length; ++i) {
                res.push(fn(arr[i], i));
            }
            return res;
        }

        function extend(a, b) {
            for (var i in b) {
                if (hasOwnProp(b, i)) {
                    a[i] = b[i];
                }
            }

            if (hasOwnProp(b, 'toString')) {
                a.toString = b.toString;
            }

            if (hasOwnProp(b, 'valueOf')) {
                a.valueOf = b.valueOf;
            }

            return a;
        }

        function createUTC(input, format, locale, strict) {
            return createLocalOrUTC(input, format, locale, strict, true).utc();
        }

        function defaultParsingFlags() {
            // We need to deep clone this object.
            return {
                empty: false,
                unusedTokens: [],
                unusedInput: [],
                overflow: -2,
                charsLeftOver: 0,
                nullInput: false,
                invalidEra: null,
                invalidMonth: null,
                invalidFormat: false,
                userInvalidated: false,
                iso: false,
                parsedDateParts: [],
                era: null,
                meridiem: null,
                rfc2822: false,
                weekdayMismatch: false,
            };
        }

        function getParsingFlags(m) {
            if (m._pf == null) {
                m._pf = defaultParsingFlags();
            }
            return m._pf;
        }

        var some;
        if (Array.prototype.some) {
            some = Array.prototype.some;
        } else {
            some = function (fun) {
                var t = Object(this),
                    len = t.length >>> 0,
                    i;

                for (i = 0; i < len; i++) {
                    if (i in t && fun.call(this, t[i], i, t)) {
                        return true;
                    }
                }

                return false;
            };
        }

        function isValid(m) {
            if (m._isValid == null) {
                var flags = getParsingFlags(m),
                    parsedParts = some.call(flags.parsedDateParts, function (i) {
                        return i != null;
                    }),
                    isNowValid =
                        !isNaN(m._d.getTime()) &&
                        flags.overflow < 0 &&
                        !flags.empty &&
                        !flags.invalidEra &&
                        !flags.invalidMonth &&
                        !flags.invalidWeekday &&
                        !flags.weekdayMismatch &&
                        !flags.nullInput &&
                        !flags.invalidFormat &&
                        !flags.userInvalidated &&
                        (!flags.meridiem || (flags.meridiem && parsedParts));

                if (m._strict) {
                    isNowValid =
                        isNowValid &&
                        flags.charsLeftOver === 0 &&
                        flags.unusedTokens.length === 0 &&
                        flags.bigHour === undefined;
                }

                if (Object.isFrozen == null || !Object.isFrozen(m)) {
                    m._isValid = isNowValid;
                } else {
                    return isNowValid;
                }
            }
            return m._isValid;
        }

        function createInvalid(flags) {
            var m = createUTC(NaN);
            if (flags != null) {
                extend(getParsingFlags(m), flags);
            } else {
                getParsingFlags(m).userInvalidated = true;
            }

            return m;
        }

        // Plugins that add properties should also add the key here (null value),
        // so we can properly clone ourselves.
        var momentProperties = (hooks.momentProperties = []),
            updateInProgress = false;

        function copyConfig(to, from) {
            var i, prop, val;

            if (!isUndefined(from._isAMomentObject)) {
                to._isAMomentObject = from._isAMomentObject;
            }
            if (!isUndefined(from._i)) {
                to._i = from._i;
            }
            if (!isUndefined(from._f)) {
                to._f = from._f;
            }
            if (!isUndefined(from._l)) {
                to._l = from._l;
            }
            if (!isUndefined(from._strict)) {
                to._strict = from._strict;
            }
            if (!isUndefined(from._tzm)) {
                to._tzm = from._tzm;
            }
            if (!isUndefined(from._isUTC)) {
                to._isUTC = from._isUTC;
            }
            if (!isUndefined(from._offset)) {
                to._offset = from._offset;
            }
            if (!isUndefined(from._pf)) {
                to._pf = getParsingFlags(from);
            }
            if (!isUndefined(from._locale)) {
                to._locale = from._locale;
            }

            if (momentProperties.length > 0) {
                for (i = 0; i < momentProperties.length; i++) {
                    prop = momentProperties[i];
                    val = from[prop];
                    if (!isUndefined(val)) {
                        to[prop] = val;
                    }
                }
            }

            return to;
        }

        // Moment prototype object
        function Moment(config) {
            copyConfig(this, config);
            this._d = new Date(config._d != null ? config._d.getTime() : NaN);
            if (!this.isValid()) {
                this._d = new Date(NaN);
            }
            // Prevent infinite loop in case updateOffset creates new moment
            // objects.
            if (updateInProgress === false) {
                updateInProgress = true;
                hooks.updateOffset(this);
                updateInProgress = false;
            }
        }

        function isMoment(obj) {
            return (
                obj instanceof Moment || (obj != null && obj._isAMomentObject != null)
            );
        }

        function warn(msg) {
            if (
                hooks.suppressDeprecationWarnings === false &&
                typeof console !== 'undefined' &&
                console.warn
            ) {
                console.warn('Deprecation warning: ' + msg);
            }
        }

        function deprecate(msg, fn) {
            var firstTime = true;

            return extend(function () {
                if (hooks.deprecationHandler != null) {
                    hooks.deprecationHandler(null, msg);
                }
                if (firstTime) {
                    var args = [],
                        arg,
                        i,
                        key;
                    for (i = 0; i < arguments.length; i++) {
                        arg = '';
                        if (typeof arguments[i] === 'object') {
                            arg += '\n[' + i + '] ';
                            for (key in arguments[0]) {
                                if (hasOwnProp(arguments[0], key)) {
                                    arg += key + ': ' + arguments[0][key] + ', ';
                                }
                            }
                            arg = arg.slice(0, -2); // Remove trailing comma and space
                        } else {
                            arg = arguments[i];
                        }
                        args.push(arg);
                    }
                    warn(
                        msg +
                            '\nArguments: ' +
                            Array.prototype.slice.call(args).join('') +
                            '\n' +
                            new Error().stack
                    );
                    firstTime = false;
                }
                return fn.apply(this, arguments);
            }, fn);
        }

        var deprecations = {};

        function deprecateSimple(name, msg) {
            if (hooks.deprecationHandler != null) {
                hooks.deprecationHandler(name, msg);
            }
            if (!deprecations[name]) {
                warn(msg);
                deprecations[name] = true;
            }
        }

        hooks.suppressDeprecationWarnings = false;
        hooks.deprecationHandler = null;

        function isFunction(input) {
            return (
                (typeof Function !== 'undefined' && input instanceof Function) ||
                Object.prototype.toString.call(input) === '[object Function]'
            );
        }

        function set(config) {
            var prop, i;
            for (i in config) {
                if (hasOwnProp(config, i)) {
                    prop = config[i];
                    if (isFunction(prop)) {
                        this[i] = prop;
                    } else {
                        this['_' + i] = prop;
                    }
                }
            }
            this._config = config;
            // Lenient ordinal parsing accepts just a number in addition to
            // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
            // TODO: Remove "ordinalParse" fallback in next major release.
            this._dayOfMonthOrdinalParseLenient = new RegExp(
                (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                    '|' +
                    /\d{1,2}/.source
            );
        }

        function mergeConfigs(parentConfig, childConfig) {
            var res = extend({}, parentConfig),
                prop;
            for (prop in childConfig) {
                if (hasOwnProp(childConfig, prop)) {
                    if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                        res[prop] = {};
                        extend(res[prop], parentConfig[prop]);
                        extend(res[prop], childConfig[prop]);
                    } else if (childConfig[prop] != null) {
                        res[prop] = childConfig[prop];
                    } else {
                        delete res[prop];
                    }
                }
            }
            for (prop in parentConfig) {
                if (
                    hasOwnProp(parentConfig, prop) &&
                    !hasOwnProp(childConfig, prop) &&
                    isObject(parentConfig[prop])
                ) {
                    // make sure changes to properties don't modify parent config
                    res[prop] = extend({}, res[prop]);
                }
            }
            return res;
        }

        function Locale(config) {
            if (config != null) {
                this.set(config);
            }
        }

        var keys;

        if (Object.keys) {
            keys = Object.keys;
        } else {
            keys = function (obj) {
                var i,
                    res = [];
                for (i in obj) {
                    if (hasOwnProp(obj, i)) {
                        res.push(i);
                    }
                }
                return res;
            };
        }

        var defaultCalendar = {
            sameDay: '[Today at] LT',
            nextDay: '[Tomorrow at] LT',
            nextWeek: 'dddd [at] LT',
            lastDay: '[Yesterday at] LT',
            lastWeek: '[Last] dddd [at] LT',
            sameElse: 'L',
        };

        function calendar(key, mom, now) {
            var output = this._calendar[key] || this._calendar['sameElse'];
            return isFunction(output) ? output.call(mom, now) : output;
        }

        function zeroFill(number, targetLength, forceSign) {
            var absNumber = '' + Math.abs(number),
                zerosToFill = targetLength - absNumber.length,
                sign = number >= 0;
            return (
                (sign ? (forceSign ? '+' : '') : '-') +
                Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) +
                absNumber
            );
        }

        var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
            localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
            formatFunctions = {},
            formatTokenFunctions = {};

        // token:    'M'
        // padded:   ['MM', 2]
        // ordinal:  'Mo'
        // callback: function () { this.month() + 1 }
        function addFormatToken(token, padded, ordinal, callback) {
            var func = callback;
            if (typeof callback === 'string') {
                func = function () {
                    return this[callback]();
                };
            }
            if (token) {
                formatTokenFunctions[token] = func;
            }
            if (padded) {
                formatTokenFunctions[padded[0]] = function () {
                    return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
                };
            }
            if (ordinal) {
                formatTokenFunctions[ordinal] = function () {
                    return this.localeData().ordinal(
                        func.apply(this, arguments),
                        token
                    );
                };
            }
        }

        function removeFormattingTokens(input) {
            if (input.match(/\[[\s\S]/)) {
                return input.replace(/^\[|\]$/g, '');
            }
            return input.replace(/\\/g, '');
        }

        function makeFormatFunction(format) {
            var array = format.match(formattingTokens),
                i,
                length;

            for (i = 0, length = array.length; i < length; i++) {
                if (formatTokenFunctions[array[i]]) {
                    array[i] = formatTokenFunctions[array[i]];
                } else {
                    array[i] = removeFormattingTokens(array[i]);
                }
            }

            return function (mom) {
                var output = '',
                    i;
                for (i = 0; i < length; i++) {
                    output += isFunction(array[i])
                        ? array[i].call(mom, format)
                        : array[i];
                }
                return output;
            };
        }

        // format date using native date object
        function formatMoment(m, format) {
            if (!m.isValid()) {
                return m.localeData().invalidDate();
            }

            format = expandFormat(format, m.localeData());
            formatFunctions[format] =
                formatFunctions[format] || makeFormatFunction(format);

            return formatFunctions[format](m);
        }

        function expandFormat(format, locale) {
            var i = 5;

            function replaceLongDateFormatTokens(input) {
                return locale.longDateFormat(input) || input;
            }

            localFormattingTokens.lastIndex = 0;
            while (i >= 0 && localFormattingTokens.test(format)) {
                format = format.replace(
                    localFormattingTokens,
                    replaceLongDateFormatTokens
                );
                localFormattingTokens.lastIndex = 0;
                i -= 1;
            }

            return format;
        }

        var defaultLongDateFormat = {
            LTS: 'h:mm:ss A',
            LT: 'h:mm A',
            L: 'MM/DD/YYYY',
            LL: 'MMMM D, YYYY',
            LLL: 'MMMM D, YYYY h:mm A',
            LLLL: 'dddd, MMMM D, YYYY h:mm A',
        };

        function longDateFormat(key) {
            var format = this._longDateFormat[key],
                formatUpper = this._longDateFormat[key.toUpperCase()];

            if (format || !formatUpper) {
                return format;
            }

            this._longDateFormat[key] = formatUpper
                .match(formattingTokens)
                .map(function (tok) {
                    if (
                        tok === 'MMMM' ||
                        tok === 'MM' ||
                        tok === 'DD' ||
                        tok === 'dddd'
                    ) {
                        return tok.slice(1);
                    }
                    return tok;
                })
                .join('');

            return this._longDateFormat[key];
        }

        var defaultInvalidDate = 'Invalid date';

        function invalidDate() {
            return this._invalidDate;
        }

        var defaultOrdinal = '%d',
            defaultDayOfMonthOrdinalParse = /\d{1,2}/;

        function ordinal(number) {
            return this._ordinal.replace('%d', number);
        }

        var defaultRelativeTime = {
            future: 'in %s',
            past: '%s ago',
            s: 'a few seconds',
            ss: '%d seconds',
            m: 'a minute',
            mm: '%d minutes',
            h: 'an hour',
            hh: '%d hours',
            d: 'a day',
            dd: '%d days',
            w: 'a week',
            ww: '%d weeks',
            M: 'a month',
            MM: '%d months',
            y: 'a year',
            yy: '%d years',
        };

        function relativeTime(number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return isFunction(output)
                ? output(number, withoutSuffix, string, isFuture)
                : output.replace(/%d/i, number);
        }

        function pastFuture(diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return isFunction(format) ? format(output) : format.replace(/%s/i, output);
        }

        var aliases = {};

        function addUnitAlias(unit, shorthand) {
            var lowerCase = unit.toLowerCase();
            aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
        }

        function normalizeUnits(units) {
            return typeof units === 'string'
                ? aliases[units] || aliases[units.toLowerCase()]
                : undefined;
        }

        function normalizeObjectUnits(inputObject) {
            var normalizedInput = {},
                normalizedProp,
                prop;

            for (prop in inputObject) {
                if (hasOwnProp(inputObject, prop)) {
                    normalizedProp = normalizeUnits(prop);
                    if (normalizedProp) {
                        normalizedInput[normalizedProp] = inputObject[prop];
                    }
                }
            }

            return normalizedInput;
        }

        var priorities = {};

        function addUnitPriority(unit, priority) {
            priorities[unit] = priority;
        }

        function getPrioritizedUnits(unitsObj) {
            var units = [],
                u;
            for (u in unitsObj) {
                if (hasOwnProp(unitsObj, u)) {
                    units.push({ unit: u, priority: priorities[u] });
                }
            }
            units.sort(function (a, b) {
                return a.priority - b.priority;
            });
            return units;
        }

        function isLeapYear(year) {
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
        }

        function absFloor(number) {
            if (number < 0) {
                // -0 -> 0
                return Math.ceil(number) || 0;
            } else {
                return Math.floor(number);
            }
        }

        function toInt(argumentForCoercion) {
            var coercedNumber = +argumentForCoercion,
                value = 0;

            if (coercedNumber !== 0 && isFinite(coercedNumber)) {
                value = absFloor(coercedNumber);
            }

            return value;
        }

        function makeGetSet(unit, keepTime) {
            return function (value) {
                if (value != null) {
                    set$1(this, unit, value);
                    hooks.updateOffset(this, keepTime);
                    return this;
                } else {
                    return get(this, unit);
                }
            };
        }

        function get(mom, unit) {
            return mom.isValid()
                ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]()
                : NaN;
        }

        function set$1(mom, unit, value) {
            if (mom.isValid() && !isNaN(value)) {
                if (
                    unit === 'FullYear' &&
                    isLeapYear(mom.year()) &&
                    mom.month() === 1 &&
                    mom.date() === 29
                ) {
                    value = toInt(value);
                    mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](
                        value,
                        mom.month(),
                        daysInMonth(value, mom.month())
                    );
                } else {
                    mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
                }
            }
        }

        // MOMENTS

        function stringGet(units) {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units]();
            }
            return this;
        }

        function stringSet(units, value) {
            if (typeof units === 'object') {
                units = normalizeObjectUnits(units);
                var prioritized = getPrioritizedUnits(units),
                    i;
                for (i = 0; i < prioritized.length; i++) {
                    this[prioritized[i].unit](units[prioritized[i].unit]);
                }
            } else {
                units = normalizeUnits(units);
                if (isFunction(this[units])) {
                    return this[units](value);
                }
            }
            return this;
        }

        var match1 = /\d/, //       0 - 9
            match2 = /\d\d/, //      00 - 99
            match3 = /\d{3}/, //     000 - 999
            match4 = /\d{4}/, //    0000 - 9999
            match6 = /[+-]?\d{6}/, // -999999 - 999999
            match1to2 = /\d\d?/, //       0 - 99
            match3to4 = /\d\d\d\d?/, //     999 - 9999
            match5to6 = /\d\d\d\d\d\d?/, //   99999 - 999999
            match1to3 = /\d{1,3}/, //       0 - 999
            match1to4 = /\d{1,4}/, //       0 - 9999
            match1to6 = /[+-]?\d{1,6}/, // -999999 - 999999
            matchUnsigned = /\d+/, //       0 - inf
            matchSigned = /[+-]?\d+/, //    -inf - inf
            matchOffset = /Z|[+-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
            matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, // +00 -00 +00:00 -00:00 +0000 -0000 or Z
            matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
            // any word (or two) characters or numbers including two/three word month in arabic.
            // includes scottish gaelic two word and hyphenated months
            matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
            regexes;

        regexes = {};

        function addRegexToken(token, regex, strictRegex) {
            regexes[token] = isFunction(regex)
                ? regex
                : function (isStrict, localeData) {
                      return isStrict && strictRegex ? strictRegex : regex;
                  };
        }

        function getParseRegexForToken(token, config) {
            if (!hasOwnProp(regexes, token)) {
                return new RegExp(unescapeFormat(token));
            }

            return regexes[token](config._strict, config._locale);
        }

        // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
        function unescapeFormat(s) {
            return regexEscape(
                s
                    .replace('\\', '')
                    .replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (
                        matched,
                        p1,
                        p2,
                        p3,
                        p4
                    ) {
                        return p1 || p2 || p3 || p4;
                    })
            );
        }

        function regexEscape(s) {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        }

        var tokens = {};

        function addParseToken(token, callback) {
            var i,
                func = callback;
            if (typeof token === 'string') {
                token = [token];
            }
            if (isNumber(callback)) {
                func = function (input, array) {
                    array[callback] = toInt(input);
                };
            }
            for (i = 0; i < token.length; i++) {
                tokens[token[i]] = func;
            }
        }

        function addWeekParseToken(token, callback) {
            addParseToken(token, function (input, array, config, token) {
                config._w = config._w || {};
                callback(input, config._w, config, token);
            });
        }

        function addTimeToArrayFromToken(token, input, config) {
            if (input != null && hasOwnProp(tokens, token)) {
                tokens[token](input, config._a, config, token);
            }
        }

        var YEAR = 0,
            MONTH = 1,
            DATE = 2,
            HOUR = 3,
            MINUTE = 4,
            SECOND = 5,
            MILLISECOND = 6,
            WEEK = 7,
            WEEKDAY = 8;

        function mod(n, x) {
            return ((n % x) + x) % x;
        }

        var indexOf;

        if (Array.prototype.indexOf) {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function (o) {
                // I know
                var i;
                for (i = 0; i < this.length; ++i) {
                    if (this[i] === o) {
                        return i;
                    }
                }
                return -1;
            };
        }

        function daysInMonth(year, month) {
            if (isNaN(year) || isNaN(month)) {
                return NaN;
            }
            var modMonth = mod(month, 12);
            year += (month - modMonth) / 12;
            return modMonth === 1
                ? isLeapYear(year)
                    ? 29
                    : 28
                : 31 - ((modMonth % 7) % 2);
        }

        // FORMATTING

        addFormatToken('M', ['MM', 2], 'Mo', function () {
            return this.month() + 1;
        });

        addFormatToken('MMM', 0, 0, function (format) {
            return this.localeData().monthsShort(this, format);
        });

        addFormatToken('MMMM', 0, 0, function (format) {
            return this.localeData().months(this, format);
        });

        // ALIASES

        addUnitAlias('month', 'M');

        // PRIORITY

        addUnitPriority('month', 8);

        // PARSING

        addRegexToken('M', match1to2);
        addRegexToken('MM', match1to2, match2);
        addRegexToken('MMM', function (isStrict, locale) {
            return locale.monthsShortRegex(isStrict);
        });
        addRegexToken('MMMM', function (isStrict, locale) {
            return locale.monthsRegex(isStrict);
        });

        addParseToken(['M', 'MM'], function (input, array) {
            array[MONTH] = toInt(input) - 1;
        });

        addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
            var month = config._locale.monthsParse(input, token, config._strict);
            // if we didn't find a month name, mark the date as invalid.
            if (month != null) {
                array[MONTH] = month;
            } else {
                getParsingFlags(config).invalidMonth = input;
            }
        });

        // LOCALES

        var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
                '_'
            ),
            defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split(
                '_'
            ),
            MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
            defaultMonthsShortRegex = matchWord,
            defaultMonthsRegex = matchWord;

        function localeMonths(m, format) {
            if (!m) {
                return isArray(this._months)
                    ? this._months
                    : this._months['standalone'];
            }
            return isArray(this._months)
                ? this._months[m.month()]
                : this._months[
                      (this._months.isFormat || MONTHS_IN_FORMAT).test(format)
                          ? 'format'
                          : 'standalone'
                  ][m.month()];
        }

        function localeMonthsShort(m, format) {
            if (!m) {
                return isArray(this._monthsShort)
                    ? this._monthsShort
                    : this._monthsShort['standalone'];
            }
            return isArray(this._monthsShort)
                ? this._monthsShort[m.month()]
                : this._monthsShort[
                      MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'
                  ][m.month()];
        }

        function handleStrictParse(monthName, format, strict) {
            var i,
                ii,
                mom,
                llc = monthName.toLocaleLowerCase();
            if (!this._monthsParse) {
                // this is not used
                this._monthsParse = [];
                this._longMonthsParse = [];
                this._shortMonthsParse = [];
                for (i = 0; i < 12; ++i) {
                    mom = createUTC([2000, i]);
                    this._shortMonthsParse[i] = this.monthsShort(
                        mom,
                        ''
                    ).toLocaleLowerCase();
                    this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
                }
            }

            if (strict) {
                if (format === 'MMM') {
                    ii = indexOf.call(this._shortMonthsParse, llc);
                    return ii !== -1 ? ii : null;
                } else {
                    ii = indexOf.call(this._longMonthsParse, llc);
                    return ii !== -1 ? ii : null;
                }
            } else {
                if (format === 'MMM') {
                    ii = indexOf.call(this._shortMonthsParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._longMonthsParse, llc);
                    return ii !== -1 ? ii : null;
                } else {
                    ii = indexOf.call(this._longMonthsParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._shortMonthsParse, llc);
                    return ii !== -1 ? ii : null;
                }
            }
        }

        function localeMonthsParse(monthName, format, strict) {
            var i, mom, regex;

            if (this._monthsParseExact) {
                return handleStrictParse.call(this, monthName, format, strict);
            }

            if (!this._monthsParse) {
                this._monthsParse = [];
                this._longMonthsParse = [];
                this._shortMonthsParse = [];
            }

            // TODO: add sorting
            // Sorting makes sure if one month (or abbr) is a prefix of another
            // see sorting in computeMonthsParse
            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                mom = createUTC([2000, i]);
                if (strict && !this._longMonthsParse[i]) {
                    this._longMonthsParse[i] = new RegExp(
                        '^' + this.months(mom, '').replace('.', '') + '$',
                        'i'
                    );
                    this._shortMonthsParse[i] = new RegExp(
                        '^' + this.monthsShort(mom, '').replace('.', '') + '$',
                        'i'
                    );
                }
                if (!strict && !this._monthsParse[i]) {
                    regex =
                        '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (
                    strict &&
                    format === 'MMMM' &&
                    this._longMonthsParse[i].test(monthName)
                ) {
                    return i;
                } else if (
                    strict &&
                    format === 'MMM' &&
                    this._shortMonthsParse[i].test(monthName)
                ) {
                    return i;
                } else if (!strict && this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        }

        // MOMENTS

        function setMonth(mom, value) {
            var dayOfMonth;

            if (!mom.isValid()) {
                // No op
                return mom;
            }

            if (typeof value === 'string') {
                if (/^\d+$/.test(value)) {
                    value = toInt(value);
                } else {
                    value = mom.localeData().monthsParse(value);
                    // TODO: Another silent failure?
                    if (!isNumber(value)) {
                        return mom;
                    }
                }
            }

            dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
            return mom;
        }

        function getSetMonth(value) {
            if (value != null) {
                setMonth(this, value);
                hooks.updateOffset(this, true);
                return this;
            } else {
                return get(this, 'Month');
            }
        }

        function getDaysInMonth() {
            return daysInMonth(this.year(), this.month());
        }

        function monthsShortRegex(isStrict) {
            if (this._monthsParseExact) {
                if (!hasOwnProp(this, '_monthsRegex')) {
                    computeMonthsParse.call(this);
                }
                if (isStrict) {
                    return this._monthsShortStrictRegex;
                } else {
                    return this._monthsShortRegex;
                }
            } else {
                if (!hasOwnProp(this, '_monthsShortRegex')) {
                    this._monthsShortRegex = defaultMonthsShortRegex;
                }
                return this._monthsShortStrictRegex && isStrict
                    ? this._monthsShortStrictRegex
                    : this._monthsShortRegex;
            }
        }

        function monthsRegex(isStrict) {
            if (this._monthsParseExact) {
                if (!hasOwnProp(this, '_monthsRegex')) {
                    computeMonthsParse.call(this);
                }
                if (isStrict) {
                    return this._monthsStrictRegex;
                } else {
                    return this._monthsRegex;
                }
            } else {
                if (!hasOwnProp(this, '_monthsRegex')) {
                    this._monthsRegex = defaultMonthsRegex;
                }
                return this._monthsStrictRegex && isStrict
                    ? this._monthsStrictRegex
                    : this._monthsRegex;
            }
        }

        function computeMonthsParse() {
            function cmpLenRev(a, b) {
                return b.length - a.length;
            }

            var shortPieces = [],
                longPieces = [],
                mixedPieces = [],
                i,
                mom;
            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                mom = createUTC([2000, i]);
                shortPieces.push(this.monthsShort(mom, ''));
                longPieces.push(this.months(mom, ''));
                mixedPieces.push(this.months(mom, ''));
                mixedPieces.push(this.monthsShort(mom, ''));
            }
            // Sorting makes sure if one month (or abbr) is a prefix of another it
            // will match the longer piece.
            shortPieces.sort(cmpLenRev);
            longPieces.sort(cmpLenRev);
            mixedPieces.sort(cmpLenRev);
            for (i = 0; i < 12; i++) {
                shortPieces[i] = regexEscape(shortPieces[i]);
                longPieces[i] = regexEscape(longPieces[i]);
            }
            for (i = 0; i < 24; i++) {
                mixedPieces[i] = regexEscape(mixedPieces[i]);
            }

            this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
            this._monthsShortRegex = this._monthsRegex;
            this._monthsStrictRegex = new RegExp(
                '^(' + longPieces.join('|') + ')',
                'i'
            );
            this._monthsShortStrictRegex = new RegExp(
                '^(' + shortPieces.join('|') + ')',
                'i'
            );
        }

        // FORMATTING

        addFormatToken('Y', 0, 0, function () {
            var y = this.year();
            return y <= 9999 ? zeroFill(y, 4) : '+' + y;
        });

        addFormatToken(0, ['YY', 2], 0, function () {
            return this.year() % 100;
        });

        addFormatToken(0, ['YYYY', 4], 0, 'year');
        addFormatToken(0, ['YYYYY', 5], 0, 'year');
        addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

        // ALIASES

        addUnitAlias('year', 'y');

        // PRIORITIES

        addUnitPriority('year', 1);

        // PARSING

        addRegexToken('Y', matchSigned);
        addRegexToken('YY', match1to2, match2);
        addRegexToken('YYYY', match1to4, match4);
        addRegexToken('YYYYY', match1to6, match6);
        addRegexToken('YYYYYY', match1to6, match6);

        addParseToken(['YYYYY', 'YYYYYY'], YEAR);
        addParseToken('YYYY', function (input, array) {
            array[YEAR] =
                input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
        });
        addParseToken('YY', function (input, array) {
            array[YEAR] = hooks.parseTwoDigitYear(input);
        });
        addParseToken('Y', function (input, array) {
            array[YEAR] = parseInt(input, 10);
        });

        // HELPERS

        function daysInYear(year) {
            return isLeapYear(year) ? 366 : 365;
        }

        // HOOKS

        hooks.parseTwoDigitYear = function (input) {
            return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
        };

        // MOMENTS

        var getSetYear = makeGetSet('FullYear', true);

        function getIsLeapYear() {
            return isLeapYear(this.year());
        }

        function createDate(y, m, d, h, M, s, ms) {
            // can't just apply() to create a date:
            // https://stackoverflow.com/q/181348
            var date;
            // the date constructor remaps years 0-99 to 1900-1999
            if (y < 100 && y >= 0) {
                // preserve leap years using a full 400 year cycle, then reset
                date = new Date(y + 400, m, d, h, M, s, ms);
                if (isFinite(date.getFullYear())) {
                    date.setFullYear(y);
                }
            } else {
                date = new Date(y, m, d, h, M, s, ms);
            }

            return date;
        }

        function createUTCDate(y) {
            var date, args;
            // the Date.UTC function remaps years 0-99 to 1900-1999
            if (y < 100 && y >= 0) {
                args = Array.prototype.slice.call(arguments);
                // preserve leap years using a full 400 year cycle, then reset
                args[0] = y + 400;
                date = new Date(Date.UTC.apply(null, args));
                if (isFinite(date.getUTCFullYear())) {
                    date.setUTCFullYear(y);
                }
            } else {
                date = new Date(Date.UTC.apply(null, arguments));
            }

            return date;
        }

        // start-of-first-week - start-of-year
        function firstWeekOffset(year, dow, doy) {
            var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
                fwd = 7 + dow - doy,
                // first-week day local weekday -- which local weekday is fwd
                fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

            return -fwdlw + fwd - 1;
        }

        // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
        function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
            var localWeekday = (7 + weekday - dow) % 7,
                weekOffset = firstWeekOffset(year, dow, doy),
                dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
                resYear,
                resDayOfYear;

            if (dayOfYear <= 0) {
                resYear = year - 1;
                resDayOfYear = daysInYear(resYear) + dayOfYear;
            } else if (dayOfYear > daysInYear(year)) {
                resYear = year + 1;
                resDayOfYear = dayOfYear - daysInYear(year);
            } else {
                resYear = year;
                resDayOfYear = dayOfYear;
            }

            return {
                year: resYear,
                dayOfYear: resDayOfYear,
            };
        }

        function weekOfYear(mom, dow, doy) {
            var weekOffset = firstWeekOffset(mom.year(), dow, doy),
                week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
                resWeek,
                resYear;

            if (week < 1) {
                resYear = mom.year() - 1;
                resWeek = week + weeksInYear(resYear, dow, doy);
            } else if (week > weeksInYear(mom.year(), dow, doy)) {
                resWeek = week - weeksInYear(mom.year(), dow, doy);
                resYear = mom.year() + 1;
            } else {
                resYear = mom.year();
                resWeek = week;
            }

            return {
                week: resWeek,
                year: resYear,
            };
        }

        function weeksInYear(year, dow, doy) {
            var weekOffset = firstWeekOffset(year, dow, doy),
                weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
            return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
        }

        // FORMATTING

        addFormatToken('w', ['ww', 2], 'wo', 'week');
        addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

        // ALIASES

        addUnitAlias('week', 'w');
        addUnitAlias('isoWeek', 'W');

        // PRIORITIES

        addUnitPriority('week', 5);
        addUnitPriority('isoWeek', 5);

        // PARSING

        addRegexToken('w', match1to2);
        addRegexToken('ww', match1to2, match2);
        addRegexToken('W', match1to2);
        addRegexToken('WW', match1to2, match2);

        addWeekParseToken(['w', 'ww', 'W', 'WW'], function (
            input,
            week,
            config,
            token
        ) {
            week[token.substr(0, 1)] = toInt(input);
        });

        // HELPERS

        // LOCALES

        function localeWeek(mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        }

        var defaultLocaleWeek = {
            dow: 0, // Sunday is the first day of the week.
            doy: 6, // The week that contains Jan 6th is the first week of the year.
        };

        function localeFirstDayOfWeek() {
            return this._week.dow;
        }

        function localeFirstDayOfYear() {
            return this._week.doy;
        }

        // MOMENTS

        function getSetWeek(input) {
            var week = this.localeData().week(this);
            return input == null ? week : this.add((input - week) * 7, 'd');
        }

        function getSetISOWeek(input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add((input - week) * 7, 'd');
        }

        // FORMATTING

        addFormatToken('d', 0, 'do', 'day');

        addFormatToken('dd', 0, 0, function (format) {
            return this.localeData().weekdaysMin(this, format);
        });

        addFormatToken('ddd', 0, 0, function (format) {
            return this.localeData().weekdaysShort(this, format);
        });

        addFormatToken('dddd', 0, 0, function (format) {
            return this.localeData().weekdays(this, format);
        });

        addFormatToken('e', 0, 0, 'weekday');
        addFormatToken('E', 0, 0, 'isoWeekday');

        // ALIASES

        addUnitAlias('day', 'd');
        addUnitAlias('weekday', 'e');
        addUnitAlias('isoWeekday', 'E');

        // PRIORITY
        addUnitPriority('day', 11);
        addUnitPriority('weekday', 11);
        addUnitPriority('isoWeekday', 11);

        // PARSING

        addRegexToken('d', match1to2);
        addRegexToken('e', match1to2);
        addRegexToken('E', match1to2);
        addRegexToken('dd', function (isStrict, locale) {
            return locale.weekdaysMinRegex(isStrict);
        });
        addRegexToken('ddd', function (isStrict, locale) {
            return locale.weekdaysShortRegex(isStrict);
        });
        addRegexToken('dddd', function (isStrict, locale) {
            return locale.weekdaysRegex(isStrict);
        });

        addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
            var weekday = config._locale.weekdaysParse(input, token, config._strict);
            // if we didn't get a weekday name, mark the date as invalid
            if (weekday != null) {
                week.d = weekday;
            } else {
                getParsingFlags(config).invalidWeekday = input;
            }
        });

        addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
            week[token] = toInt(input);
        });

        // HELPERS

        function parseWeekday(input, locale) {
            if (typeof input !== 'string') {
                return input;
            }

            if (!isNaN(input)) {
                return parseInt(input, 10);
            }

            input = locale.weekdaysParse(input);
            if (typeof input === 'number') {
                return input;
            }

            return null;
        }

        function parseIsoWeekday(input, locale) {
            if (typeof input === 'string') {
                return locale.weekdaysParse(input) % 7 || 7;
            }
            return isNaN(input) ? null : input;
        }

        // LOCALES
        function shiftWeekdays(ws, n) {
            return ws.slice(n, 7).concat(ws.slice(0, n));
        }

        var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
                '_'
            ),
            defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
            defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
            defaultWeekdaysRegex = matchWord,
            defaultWeekdaysShortRegex = matchWord,
            defaultWeekdaysMinRegex = matchWord;

        function localeWeekdays(m, format) {
            var weekdays = isArray(this._weekdays)
                ? this._weekdays
                : this._weekdays[
                      m && m !== true && this._weekdays.isFormat.test(format)
                          ? 'format'
                          : 'standalone'
                  ];
            return m === true
                ? shiftWeekdays(weekdays, this._week.dow)
                : m
                ? weekdays[m.day()]
                : weekdays;
        }

        function localeWeekdaysShort(m) {
            return m === true
                ? shiftWeekdays(this._weekdaysShort, this._week.dow)
                : m
                ? this._weekdaysShort[m.day()]
                : this._weekdaysShort;
        }

        function localeWeekdaysMin(m) {
            return m === true
                ? shiftWeekdays(this._weekdaysMin, this._week.dow)
                : m
                ? this._weekdaysMin[m.day()]
                : this._weekdaysMin;
        }

        function handleStrictParse$1(weekdayName, format, strict) {
            var i,
                ii,
                mom,
                llc = weekdayName.toLocaleLowerCase();
            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
                this._shortWeekdaysParse = [];
                this._minWeekdaysParse = [];

                for (i = 0; i < 7; ++i) {
                    mom = createUTC([2000, 1]).day(i);
                    this._minWeekdaysParse[i] = this.weekdaysMin(
                        mom,
                        ''
                    ).toLocaleLowerCase();
                    this._shortWeekdaysParse[i] = this.weekdaysShort(
                        mom,
                        ''
                    ).toLocaleLowerCase();
                    this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
                }
            }

            if (strict) {
                if (format === 'dddd') {
                    ii = indexOf.call(this._weekdaysParse, llc);
                    return ii !== -1 ? ii : null;
                } else if (format === 'ddd') {
                    ii = indexOf.call(this._shortWeekdaysParse, llc);
                    return ii !== -1 ? ii : null;
                } else {
                    ii = indexOf.call(this._minWeekdaysParse, llc);
                    return ii !== -1 ? ii : null;
                }
            } else {
                if (format === 'dddd') {
                    ii = indexOf.call(this._weekdaysParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._shortWeekdaysParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._minWeekdaysParse, llc);
                    return ii !== -1 ? ii : null;
                } else if (format === 'ddd') {
                    ii = indexOf.call(this._shortWeekdaysParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._weekdaysParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._minWeekdaysParse, llc);
                    return ii !== -1 ? ii : null;
                } else {
                    ii = indexOf.call(this._minWeekdaysParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._weekdaysParse, llc);
                    if (ii !== -1) {
                        return ii;
                    }
                    ii = indexOf.call(this._shortWeekdaysParse, llc);
                    return ii !== -1 ? ii : null;
                }
            }
        }

        function localeWeekdaysParse(weekdayName, format, strict) {
            var i, mom, regex;

            if (this._weekdaysParseExact) {
                return handleStrictParse$1.call(this, weekdayName, format, strict);
            }

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
                this._minWeekdaysParse = [];
                this._shortWeekdaysParse = [];
                this._fullWeekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already

                mom = createUTC([2000, 1]).day(i);
                if (strict && !this._fullWeekdaysParse[i]) {
                    this._fullWeekdaysParse[i] = new RegExp(
                        '^' + this.weekdays(mom, '').replace('.', '\\.?') + '$',
                        'i'
                    );
                    this._shortWeekdaysParse[i] = new RegExp(
                        '^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$',
                        'i'
                    );
                    this._minWeekdaysParse[i] = new RegExp(
                        '^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$',
                        'i'
                    );
                }
                if (!this._weekdaysParse[i]) {
                    regex =
                        '^' +
                        this.weekdays(mom, '') +
                        '|^' +
                        this.weekdaysShort(mom, '') +
                        '|^' +
                        this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (
                    strict &&
                    format === 'dddd' &&
                    this._fullWeekdaysParse[i].test(weekdayName)
                ) {
                    return i;
                } else if (
                    strict &&
                    format === 'ddd' &&
                    this._shortWeekdaysParse[i].test(weekdayName)
                ) {
                    return i;
                } else if (
                    strict &&
                    format === 'dd' &&
                    this._minWeekdaysParse[i].test(weekdayName)
                ) {
                    return i;
                } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        }

        // MOMENTS

        function getSetDayOfWeek(input) {
            if (!this.isValid()) {
                return input != null ? this : NaN;
            }
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.localeData());
                return this.add(input - day, 'd');
            } else {
                return day;
            }
        }

        function getSetLocaleDayOfWeek(input) {
            if (!this.isValid()) {
                return input != null ? this : NaN;
            }
            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return input == null ? weekday : this.add(input - weekday, 'd');
        }

        function getSetISODayOfWeek(input) {
            if (!this.isValid()) {
                return input != null ? this : NaN;
            }

            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.

            if (input != null) {
                var weekday = parseIsoWeekday(input, this.localeData());
                return this.day(this.day() % 7 ? weekday : weekday - 7);
            } else {
                return this.day() || 7;
            }
        }

        function weekdaysRegex(isStrict) {
            if (this._weekdaysParseExact) {
                if (!hasOwnProp(this, '_weekdaysRegex')) {
                    computeWeekdaysParse.call(this);
                }
                if (isStrict) {
                    return this._weekdaysStrictRegex;
                } else {
                    return this._weekdaysRegex;
                }
            } else {
                if (!hasOwnProp(this, '_weekdaysRegex')) {
                    this._weekdaysRegex = defaultWeekdaysRegex;
                }
                return this._weekdaysStrictRegex && isStrict
                    ? this._weekdaysStrictRegex
                    : this._weekdaysRegex;
            }
        }

        function weekdaysShortRegex(isStrict) {
            if (this._weekdaysParseExact) {
                if (!hasOwnProp(this, '_weekdaysRegex')) {
                    computeWeekdaysParse.call(this);
                }
                if (isStrict) {
                    return this._weekdaysShortStrictRegex;
                } else {
                    return this._weekdaysShortRegex;
                }
            } else {
                if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                    this._weekdaysShortRegex = defaultWeekdaysShortRegex;
                }
                return this._weekdaysShortStrictRegex && isStrict
                    ? this._weekdaysShortStrictRegex
                    : this._weekdaysShortRegex;
            }
        }

        function weekdaysMinRegex(isStrict) {
            if (this._weekdaysParseExact) {
                if (!hasOwnProp(this, '_weekdaysRegex')) {
                    computeWeekdaysParse.call(this);
                }
                if (isStrict) {
                    return this._weekdaysMinStrictRegex;
                } else {
                    return this._weekdaysMinRegex;
                }
            } else {
                if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                    this._weekdaysMinRegex = defaultWeekdaysMinRegex;
                }
                return this._weekdaysMinStrictRegex && isStrict
                    ? this._weekdaysMinStrictRegex
                    : this._weekdaysMinRegex;
            }
        }

        function computeWeekdaysParse() {
            function cmpLenRev(a, b) {
                return b.length - a.length;
            }

            var minPieces = [],
                shortPieces = [],
                longPieces = [],
                mixedPieces = [],
                i,
                mom,
                minp,
                shortp,
                longp;
            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                mom = createUTC([2000, 1]).day(i);
                minp = regexEscape(this.weekdaysMin(mom, ''));
                shortp = regexEscape(this.weekdaysShort(mom, ''));
                longp = regexEscape(this.weekdays(mom, ''));
                minPieces.push(minp);
                shortPieces.push(shortp);
                longPieces.push(longp);
                mixedPieces.push(minp);
                mixedPieces.push(shortp);
                mixedPieces.push(longp);
            }
            // Sorting makes sure if one weekday (or abbr) is a prefix of another it
            // will match the longer piece.
            minPieces.sort(cmpLenRev);
            shortPieces.sort(cmpLenRev);
            longPieces.sort(cmpLenRev);
            mixedPieces.sort(cmpLenRev);

            this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
            this._weekdaysShortRegex = this._weekdaysRegex;
            this._weekdaysMinRegex = this._weekdaysRegex;

            this._weekdaysStrictRegex = new RegExp(
                '^(' + longPieces.join('|') + ')',
                'i'
            );
            this._weekdaysShortStrictRegex = new RegExp(
                '^(' + shortPieces.join('|') + ')',
                'i'
            );
            this._weekdaysMinStrictRegex = new RegExp(
                '^(' + minPieces.join('|') + ')',
                'i'
            );
        }

        // FORMATTING

        function hFormat() {
            return this.hours() % 12 || 12;
        }

        function kFormat() {
            return this.hours() || 24;
        }

        addFormatToken('H', ['HH', 2], 0, 'hour');
        addFormatToken('h', ['hh', 2], 0, hFormat);
        addFormatToken('k', ['kk', 2], 0, kFormat);

        addFormatToken('hmm', 0, 0, function () {
            return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
        });

        addFormatToken('hmmss', 0, 0, function () {
            return (
                '' +
                hFormat.apply(this) +
                zeroFill(this.minutes(), 2) +
                zeroFill(this.seconds(), 2)
            );
        });

        addFormatToken('Hmm', 0, 0, function () {
            return '' + this.hours() + zeroFill(this.minutes(), 2);
        });

        addFormatToken('Hmmss', 0, 0, function () {
            return (
                '' +
                this.hours() +
                zeroFill(this.minutes(), 2) +
                zeroFill(this.seconds(), 2)
            );
        });

        function meridiem(token, lowercase) {
            addFormatToken(token, 0, 0, function () {
                return this.localeData().meridiem(
                    this.hours(),
                    this.minutes(),
                    lowercase
                );
            });
        }

        meridiem('a', true);
        meridiem('A', false);

        // ALIASES

        addUnitAlias('hour', 'h');

        // PRIORITY
        addUnitPriority('hour', 13);

        // PARSING

        function matchMeridiem(isStrict, locale) {
            return locale._meridiemParse;
        }

        addRegexToken('a', matchMeridiem);
        addRegexToken('A', matchMeridiem);
        addRegexToken('H', match1to2);
        addRegexToken('h', match1to2);
        addRegexToken('k', match1to2);
        addRegexToken('HH', match1to2, match2);
        addRegexToken('hh', match1to2, match2);
        addRegexToken('kk', match1to2, match2);

        addRegexToken('hmm', match3to4);
        addRegexToken('hmmss', match5to6);
        addRegexToken('Hmm', match3to4);
        addRegexToken('Hmmss', match5to6);

        addParseToken(['H', 'HH'], HOUR);
        addParseToken(['k', 'kk'], function (input, array, config) {
            var kInput = toInt(input);
            array[HOUR] = kInput === 24 ? 0 : kInput;
        });
        addParseToken(['a', 'A'], function (input, array, config) {
            config._isPm = config._locale.isPM(input);
            config._meridiem = input;
        });
        addParseToken(['h', 'hh'], function (input, array, config) {
            array[HOUR] = toInt(input);
            getParsingFlags(config).bigHour = true;
        });
        addParseToken('hmm', function (input, array, config) {
            var pos = input.length - 2;
            array[HOUR] = toInt(input.substr(0, pos));
            array[MINUTE] = toInt(input.substr(pos));
            getParsingFlags(config).bigHour = true;
        });
        addParseToken('hmmss', function (input, array, config) {
            var pos1 = input.length - 4,
                pos2 = input.length - 2;
            array[HOUR] = toInt(input.substr(0, pos1));
            array[MINUTE] = toInt(input.substr(pos1, 2));
            array[SECOND] = toInt(input.substr(pos2));
            getParsingFlags(config).bigHour = true;
        });
        addParseToken('Hmm', function (input, array, config) {
            var pos = input.length - 2;
            array[HOUR] = toInt(input.substr(0, pos));
            array[MINUTE] = toInt(input.substr(pos));
        });
        addParseToken('Hmmss', function (input, array, config) {
            var pos1 = input.length - 4,
                pos2 = input.length - 2;
            array[HOUR] = toInt(input.substr(0, pos1));
            array[MINUTE] = toInt(input.substr(pos1, 2));
            array[SECOND] = toInt(input.substr(pos2));
        });

        // LOCALES

        function localeIsPM(input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return (input + '').toLowerCase().charAt(0) === 'p';
        }

        var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
            // Setting the hour should keep the time, because the user explicitly
            // specified which hour they want. So trying to maintain the same hour (in
            // a new timezone) makes sense. Adding/subtracting hours does not follow
            // this rule.
            getSetHour = makeGetSet('Hours', true);

        function localeMeridiem(hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        }

        var baseConfig = {
            calendar: defaultCalendar,
            longDateFormat: defaultLongDateFormat,
            invalidDate: defaultInvalidDate,
            ordinal: defaultOrdinal,
            dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
            relativeTime: defaultRelativeTime,

            months: defaultLocaleMonths,
            monthsShort: defaultLocaleMonthsShort,

            week: defaultLocaleWeek,

            weekdays: defaultLocaleWeekdays,
            weekdaysMin: defaultLocaleWeekdaysMin,
            weekdaysShort: defaultLocaleWeekdaysShort,

            meridiemParse: defaultLocaleMeridiemParse,
        };

        // internal storage for locale config files
        var locales = {},
            localeFamilies = {},
            globalLocale;

        function commonPrefix(arr1, arr2) {
            var i,
                minl = Math.min(arr1.length, arr2.length);
            for (i = 0; i < minl; i += 1) {
                if (arr1[i] !== arr2[i]) {
                    return i;
                }
            }
            return minl;
        }

        function normalizeLocale(key) {
            return key ? key.toLowerCase().replace('_', '-') : key;
        }

        // pick the locale from the array
        // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
        // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
        function chooseLocale(names) {
            var i = 0,
                j,
                next,
                locale,
                split;

            while (i < names.length) {
                split = normalizeLocale(names[i]).split('-');
                j = split.length;
                next = normalizeLocale(names[i + 1]);
                next = next ? next.split('-') : null;
                while (j > 0) {
                    locale = loadLocale(split.slice(0, j).join('-'));
                    if (locale) {
                        return locale;
                    }
                    if (
                        next &&
                        next.length >= j &&
                        commonPrefix(split, next) >= j - 1
                    ) {
                        //the next array item is better than a shallower substring of this one
                        break;
                    }
                    j--;
                }
                i++;
            }
            return globalLocale;
        }

        function loadLocale(name) {
            var oldLocale = null,
                aliasedRequire;
            // TODO: Find a better way to register and load all the locales in Node
            if (
                locales[name] === undefined &&
                'object' !== 'undefined' &&
                module &&
                module.exports
            ) {
                try {
                    oldLocale = globalLocale._abbr;
                    aliasedRequire = commonjsRequire;
                    aliasedRequire('./locale/' + name);
                    getSetGlobalLocale(oldLocale);
                } catch (e) {
                    // mark as not found to avoid repeating expensive file require call causing high CPU
                    // when trying to find en-US, en_US, en-us for every format call
                    locales[name] = null; // null means not found
                }
            }
            return locales[name];
        }

        // This function will load locale and then set the global locale.  If
        // no arguments are passed in, it will simply return the current global
        // locale key.
        function getSetGlobalLocale(key, values) {
            var data;
            if (key) {
                if (isUndefined(values)) {
                    data = getLocale(key);
                } else {
                    data = defineLocale(key, values);
                }

                if (data) {
                    // moment.duration._locale = moment._locale = data;
                    globalLocale = data;
                } else {
                    if (typeof console !== 'undefined' && console.warn) {
                        //warn user if arguments are passed but the locale could not be set
                        console.warn(
                            'Locale ' + key + ' not found. Did you forget to load it?'
                        );
                    }
                }
            }

            return globalLocale._abbr;
        }

        function defineLocale(name, config) {
            if (config !== null) {
                var locale,
                    parentConfig = baseConfig;
                config.abbr = name;
                if (locales[name] != null) {
                    deprecateSimple(
                        'defineLocaleOverride',
                        'use moment.updateLocale(localeName, config) to change ' +
                            'an existing locale. moment.defineLocale(localeName, ' +
                            'config) should only be used for creating a new locale ' +
                            'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.'
                    );
                    parentConfig = locales[name]._config;
                } else if (config.parentLocale != null) {
                    if (locales[config.parentLocale] != null) {
                        parentConfig = locales[config.parentLocale]._config;
                    } else {
                        locale = loadLocale(config.parentLocale);
                        if (locale != null) {
                            parentConfig = locale._config;
                        } else {
                            if (!localeFamilies[config.parentLocale]) {
                                localeFamilies[config.parentLocale] = [];
                            }
                            localeFamilies[config.parentLocale].push({
                                name: name,
                                config: config,
                            });
                            return null;
                        }
                    }
                }
                locales[name] = new Locale(mergeConfigs(parentConfig, config));

                if (localeFamilies[name]) {
                    localeFamilies[name].forEach(function (x) {
                        defineLocale(x.name, x.config);
                    });
                }

                // backwards compat for now: also set the locale
                // make sure we set the locale AFTER all child locales have been
                // created, so we won't end up with the child locale set.
                getSetGlobalLocale(name);

                return locales[name];
            } else {
                // useful for testing
                delete locales[name];
                return null;
            }
        }

        function updateLocale(name, config) {
            if (config != null) {
                var locale,
                    tmpLocale,
                    parentConfig = baseConfig;

                if (locales[name] != null && locales[name].parentLocale != null) {
                    // Update existing child locale in-place to avoid memory-leaks
                    locales[name].set(mergeConfigs(locales[name]._config, config));
                } else {
                    // MERGE
                    tmpLocale = loadLocale(name);
                    if (tmpLocale != null) {
                        parentConfig = tmpLocale._config;
                    }
                    config = mergeConfigs(parentConfig, config);
                    if (tmpLocale == null) {
                        // updateLocale is called for creating a new locale
                        // Set abbr so it will have a name (getters return
                        // undefined otherwise).
                        config.abbr = name;
                    }
                    locale = new Locale(config);
                    locale.parentLocale = locales[name];
                    locales[name] = locale;
                }

                // backwards compat for now: also set the locale
                getSetGlobalLocale(name);
            } else {
                // pass null for config to unupdate, useful for tests
                if (locales[name] != null) {
                    if (locales[name].parentLocale != null) {
                        locales[name] = locales[name].parentLocale;
                        if (name === getSetGlobalLocale()) {
                            getSetGlobalLocale(name);
                        }
                    } else if (locales[name] != null) {
                        delete locales[name];
                    }
                }
            }
            return locales[name];
        }

        // returns locale data
        function getLocale(key) {
            var locale;

            if (key && key._locale && key._locale._abbr) {
                key = key._locale._abbr;
            }

            if (!key) {
                return globalLocale;
            }

            if (!isArray(key)) {
                //short-circuit everything else
                locale = loadLocale(key);
                if (locale) {
                    return locale;
                }
                key = [key];
            }

            return chooseLocale(key);
        }

        function listLocales() {
            return keys(locales);
        }

        function checkOverflow(m) {
            var overflow,
                a = m._a;

            if (a && getParsingFlags(m).overflow === -2) {
                overflow =
                    a[MONTH] < 0 || a[MONTH] > 11
                        ? MONTH
                        : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH])
                        ? DATE
                        : a[HOUR] < 0 ||
                          a[HOUR] > 24 ||
                          (a[HOUR] === 24 &&
                              (a[MINUTE] !== 0 ||
                                  a[SECOND] !== 0 ||
                                  a[MILLISECOND] !== 0))
                        ? HOUR
                        : a[MINUTE] < 0 || a[MINUTE] > 59
                        ? MINUTE
                        : a[SECOND] < 0 || a[SECOND] > 59
                        ? SECOND
                        : a[MILLISECOND] < 0 || a[MILLISECOND] > 999
                        ? MILLISECOND
                        : -1;

                if (
                    getParsingFlags(m)._overflowDayOfYear &&
                    (overflow < YEAR || overflow > DATE)
                ) {
                    overflow = DATE;
                }
                if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                    overflow = WEEK;
                }
                if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                    overflow = WEEKDAY;
                }

                getParsingFlags(m).overflow = overflow;
            }

            return m;
        }

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
            basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
            tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
            isoDates = [
                ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
                ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
                ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
                ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
                ['YYYY-DDD', /\d{4}-\d{3}/],
                ['YYYY-MM', /\d{4}-\d\d/, false],
                ['YYYYYYMMDD', /[+-]\d{10}/],
                ['YYYYMMDD', /\d{8}/],
                ['GGGG[W]WWE', /\d{4}W\d{3}/],
                ['GGGG[W]WW', /\d{4}W\d{2}/, false],
                ['YYYYDDD', /\d{7}/],
                ['YYYYMM', /\d{6}/, false],
                ['YYYY', /\d{4}/, false],
            ],
            // iso time formats and regexes
            isoTimes = [
                ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
                ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
                ['HH:mm:ss', /\d\d:\d\d:\d\d/],
                ['HH:mm', /\d\d:\d\d/],
                ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
                ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
                ['HHmmss', /\d\d\d\d\d\d/],
                ['HHmm', /\d\d\d\d/],
                ['HH', /\d\d/],
            ],
            aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
            // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
            rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
            obsOffsets = {
                UT: 0,
                GMT: 0,
                EDT: -4 * 60,
                EST: -5 * 60,
                CDT: -5 * 60,
                CST: -6 * 60,
                MDT: -6 * 60,
                MST: -7 * 60,
                PDT: -7 * 60,
                PST: -8 * 60,
            };

        // date from iso format
        function configFromISO(config) {
            var i,
                l,
                string = config._i,
                match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
                allowTime,
                dateFormat,
                timeFormat,
                tzFormat;

            if (match) {
                getParsingFlags(config).iso = true;

                for (i = 0, l = isoDates.length; i < l; i++) {
                    if (isoDates[i][1].exec(match[1])) {
                        dateFormat = isoDates[i][0];
                        allowTime = isoDates[i][2] !== false;
                        break;
                    }
                }
                if (dateFormat == null) {
                    config._isValid = false;
                    return;
                }
                if (match[3]) {
                    for (i = 0, l = isoTimes.length; i < l; i++) {
                        if (isoTimes[i][1].exec(match[3])) {
                            // match[2] should be 'T' or space
                            timeFormat = (match[2] || ' ') + isoTimes[i][0];
                            break;
                        }
                    }
                    if (timeFormat == null) {
                        config._isValid = false;
                        return;
                    }
                }
                if (!allowTime && timeFormat != null) {
                    config._isValid = false;
                    return;
                }
                if (match[4]) {
                    if (tzRegex.exec(match[4])) {
                        tzFormat = 'Z';
                    } else {
                        config._isValid = false;
                        return;
                    }
                }
                config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
                configFromStringAndFormat(config);
            } else {
                config._isValid = false;
            }
        }

        function extractFromRFC2822Strings(
            yearStr,
            monthStr,
            dayStr,
            hourStr,
            minuteStr,
            secondStr
        ) {
            var result = [
                untruncateYear(yearStr),
                defaultLocaleMonthsShort.indexOf(monthStr),
                parseInt(dayStr, 10),
                parseInt(hourStr, 10),
                parseInt(minuteStr, 10),
            ];

            if (secondStr) {
                result.push(parseInt(secondStr, 10));
            }

            return result;
        }

        function untruncateYear(yearStr) {
            var year = parseInt(yearStr, 10);
            if (year <= 49) {
                return 2000 + year;
            } else if (year <= 999) {
                return 1900 + year;
            }
            return year;
        }

        function preprocessRFC2822(s) {
            // Remove comments and folding whitespace and replace multiple-spaces with a single space
            return s
                .replace(/\([^)]*\)|[\n\t]/g, ' ')
                .replace(/(\s\s+)/g, ' ')
                .replace(/^\s\s*/, '')
                .replace(/\s\s*$/, '');
        }

        function checkWeekday(weekdayStr, parsedInput, config) {
            if (weekdayStr) {
                // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
                var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                    weekdayActual = new Date(
                        parsedInput[0],
                        parsedInput[1],
                        parsedInput[2]
                    ).getDay();
                if (weekdayProvided !== weekdayActual) {
                    getParsingFlags(config).weekdayMismatch = true;
                    config._isValid = false;
                    return false;
                }
            }
            return true;
        }

        function calculateOffset(obsOffset, militaryOffset, numOffset) {
            if (obsOffset) {
                return obsOffsets[obsOffset];
            } else if (militaryOffset) {
                // the only allowed military tz is Z
                return 0;
            } else {
                var hm = parseInt(numOffset, 10),
                    m = hm % 100,
                    h = (hm - m) / 100;
                return h * 60 + m;
            }
        }

        // date and time from ref 2822 format
        function configFromRFC2822(config) {
            var match = rfc2822.exec(preprocessRFC2822(config._i)),
                parsedArray;
            if (match) {
                parsedArray = extractFromRFC2822Strings(
                    match[4],
                    match[3],
                    match[2],
                    match[5],
                    match[6],
                    match[7]
                );
                if (!checkWeekday(match[1], parsedArray, config)) {
                    return;
                }

                config._a = parsedArray;
                config._tzm = calculateOffset(match[8], match[9], match[10]);

                config._d = createUTCDate.apply(null, config._a);
                config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

                getParsingFlags(config).rfc2822 = true;
            } else {
                config._isValid = false;
            }
        }

        // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict
        function configFromString(config) {
            var matched = aspNetJsonRegex.exec(config._i);
            if (matched !== null) {
                config._d = new Date(+matched[1]);
                return;
            }

            configFromISO(config);
            if (config._isValid === false) {
                delete config._isValid;
            } else {
                return;
            }

            configFromRFC2822(config);
            if (config._isValid === false) {
                delete config._isValid;
            } else {
                return;
            }

            if (config._strict) {
                config._isValid = false;
            } else {
                // Final attempt, use Input Fallback
                hooks.createFromInputFallback(config);
            }
        }

        hooks.createFromInputFallback = deprecate(
            'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
                'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
                'discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.',
            function (config) {
                config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
            }
        );

        // Pick the first defined of two or three arguments.
        function defaults(a, b, c) {
            if (a != null) {
                return a;
            }
            if (b != null) {
                return b;
            }
            return c;
        }

        function currentDateArray(config) {
            // hooks is actually the exported moment object
            var nowValue = new Date(hooks.now());
            if (config._useUTC) {
                return [
                    nowValue.getUTCFullYear(),
                    nowValue.getUTCMonth(),
                    nowValue.getUTCDate(),
                ];
            }
            return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
        }

        // convert an array to a date.
        // the array should mirror the parameters below
        // note: all values past the year are optional and will default to the lowest possible value.
        // [year, month, day , hour, minute, second, millisecond]
        function configFromArray(config) {
            var i,
                date,
                input = [],
                currentDate,
                expectedWeekday,
                yearToUse;

            if (config._d) {
                return;
            }

            currentDate = currentDateArray(config);

            //compute day of the year from weeks and weekdays
            if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
                dayOfYearFromWeekInfo(config);
            }

            //if the day of the year is set, figure out what it is
            if (config._dayOfYear != null) {
                yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

                if (
                    config._dayOfYear > daysInYear(yearToUse) ||
                    config._dayOfYear === 0
                ) {
                    getParsingFlags(config)._overflowDayOfYear = true;
                }

                date = createUTCDate(yearToUse, 0, config._dayOfYear);
                config._a[MONTH] = date.getUTCMonth();
                config._a[DATE] = date.getUTCDate();
            }

            // Default to current date.
            // * if no year, month, day of month are given, default to today
            // * if day of month is given, default month and year
            // * if month is given, default only year
            // * if year is given, don't default anything
            for (i = 0; i < 3 && config._a[i] == null; ++i) {
                config._a[i] = input[i] = currentDate[i];
            }

            // Zero out whatever was not defaulted, including time
            for (; i < 7; i++) {
                config._a[i] = input[i] =
                    config._a[i] == null ? (i === 2 ? 1 : 0) : config._a[i];
            }

            // Check for 24:00:00.000
            if (
                config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0
            ) {
                config._nextDay = true;
                config._a[HOUR] = 0;
            }

            config._d = (config._useUTC ? createUTCDate : createDate).apply(
                null,
                input
            );
            expectedWeekday = config._useUTC
                ? config._d.getUTCDay()
                : config._d.getDay();

            // Apply timezone offset from input. The actual utcOffset can be changed
            // with parseZone.
            if (config._tzm != null) {
                config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
            }

            if (config._nextDay) {
                config._a[HOUR] = 24;
            }

            // check for mismatching day of week
            if (
                config._w &&
                typeof config._w.d !== 'undefined' &&
                config._w.d !== expectedWeekday
            ) {
                getParsingFlags(config).weekdayMismatch = true;
            }
        }

        function dayOfYearFromWeekInfo(config) {
            var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;

            w = config._w;
            if (w.GG != null || w.W != null || w.E != null) {
                dow = 1;
                doy = 4;

                // TODO: We need to take the current isoWeekYear, but that depends on
                // how we interpret now (local, utc, fixed offset). So create
                // a now version of current config (take local/utc/offset flags, and
                // create now).
                weekYear = defaults(
                    w.GG,
                    config._a[YEAR],
                    weekOfYear(createLocal(), 1, 4).year
                );
                week = defaults(w.W, 1);
                weekday = defaults(w.E, 1);
                if (weekday < 1 || weekday > 7) {
                    weekdayOverflow = true;
                }
            } else {
                dow = config._locale._week.dow;
                doy = config._locale._week.doy;

                curWeek = weekOfYear(createLocal(), dow, doy);

                weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

                // Default to current week.
                week = defaults(w.w, curWeek.week);

                if (w.d != null) {
                    // weekday -- low day numbers are considered next week
                    weekday = w.d;
                    if (weekday < 0 || weekday > 6) {
                        weekdayOverflow = true;
                    }
                } else if (w.e != null) {
                    // local weekday -- counting starts from beginning of week
                    weekday = w.e + dow;
                    if (w.e < 0 || w.e > 6) {
                        weekdayOverflow = true;
                    }
                } else {
                    // default to beginning of week
                    weekday = dow;
                }
            }
            if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
                getParsingFlags(config)._overflowWeeks = true;
            } else if (weekdayOverflow != null) {
                getParsingFlags(config)._overflowWeekday = true;
            } else {
                temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
                config._a[YEAR] = temp.year;
                config._dayOfYear = temp.dayOfYear;
            }
        }

        // constant that refers to the ISO standard
        hooks.ISO_8601 = function () {};

        // constant that refers to the RFC 2822 form
        hooks.RFC_2822 = function () {};

        // date from string and format string
        function configFromStringAndFormat(config) {
            // TODO: Move this to another part of the creation flow to prevent circular deps
            if (config._f === hooks.ISO_8601) {
                configFromISO(config);
                return;
            }
            if (config._f === hooks.RFC_2822) {
                configFromRFC2822(config);
                return;
            }
            config._a = [];
            getParsingFlags(config).empty = true;

            // This array is used to make a Date, either with `new Date` or `Date.UTC`
            var string = '' + config._i,
                i,
                parsedInput,
                tokens,
                token,
                skipped,
                stringLength = string.length,
                totalParsedInputLength = 0,
                era;

            tokens =
                expandFormat(config._f, config._locale).match(formattingTokens) || [];

            for (i = 0; i < tokens.length; i++) {
                token = tokens[i];
                parsedInput = (string.match(getParseRegexForToken(token, config)) ||
                    [])[0];
                if (parsedInput) {
                    skipped = string.substr(0, string.indexOf(parsedInput));
                    if (skipped.length > 0) {
                        getParsingFlags(config).unusedInput.push(skipped);
                    }
                    string = string.slice(
                        string.indexOf(parsedInput) + parsedInput.length
                    );
                    totalParsedInputLength += parsedInput.length;
                }
                // don't parse if it's not a known token
                if (formatTokenFunctions[token]) {
                    if (parsedInput) {
                        getParsingFlags(config).empty = false;
                    } else {
                        getParsingFlags(config).unusedTokens.push(token);
                    }
                    addTimeToArrayFromToken(token, parsedInput, config);
                } else if (config._strict && !parsedInput) {
                    getParsingFlags(config).unusedTokens.push(token);
                }
            }

            // add remaining unparsed input length to the string
            getParsingFlags(config).charsLeftOver =
                stringLength - totalParsedInputLength;
            if (string.length > 0) {
                getParsingFlags(config).unusedInput.push(string);
            }

            // clear _12h flag if hour is <= 12
            if (
                config._a[HOUR] <= 12 &&
                getParsingFlags(config).bigHour === true &&
                config._a[HOUR] > 0
            ) {
                getParsingFlags(config).bigHour = undefined;
            }

            getParsingFlags(config).parsedDateParts = config._a.slice(0);
            getParsingFlags(config).meridiem = config._meridiem;
            // handle meridiem
            config._a[HOUR] = meridiemFixWrap(
                config._locale,
                config._a[HOUR],
                config._meridiem
            );

            // handle era
            era = getParsingFlags(config).era;
            if (era !== null) {
                config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]);
            }

            configFromArray(config);
            checkOverflow(config);
        }

        function meridiemFixWrap(locale, hour, meridiem) {
            var isPm;

            if (meridiem == null) {
                // nothing to do
                return hour;
            }
            if (locale.meridiemHour != null) {
                return locale.meridiemHour(hour, meridiem);
            } else if (locale.isPM != null) {
                // Fallback
                isPm = locale.isPM(meridiem);
                if (isPm && hour < 12) {
                    hour += 12;
                }
                if (!isPm && hour === 12) {
                    hour = 0;
                }
                return hour;
            } else {
                // this is not supposed to happen
                return hour;
            }
        }

        // date from string and array of format strings
        function configFromStringAndArray(config) {
            var tempConfig,
                bestMoment,
                scoreToBeat,
                i,
                currentScore,
                validFormatFound,
                bestFormatIsValid = false;

            if (config._f.length === 0) {
                getParsingFlags(config).invalidFormat = true;
                config._d = new Date(NaN);
                return;
            }

            for (i = 0; i < config._f.length; i++) {
                currentScore = 0;
                validFormatFound = false;
                tempConfig = copyConfig({}, config);
                if (config._useUTC != null) {
                    tempConfig._useUTC = config._useUTC;
                }
                tempConfig._f = config._f[i];
                configFromStringAndFormat(tempConfig);

                if (isValid(tempConfig)) {
                    validFormatFound = true;
                }

                // if there is any input that was not parsed add a penalty for that format
                currentScore += getParsingFlags(tempConfig).charsLeftOver;

                //or tokens
                currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

                getParsingFlags(tempConfig).score = currentScore;

                if (!bestFormatIsValid) {
                    if (
                        scoreToBeat == null ||
                        currentScore < scoreToBeat ||
                        validFormatFound
                    ) {
                        scoreToBeat = currentScore;
                        bestMoment = tempConfig;
                        if (validFormatFound) {
                            bestFormatIsValid = true;
                        }
                    }
                } else {
                    if (currentScore < scoreToBeat) {
                        scoreToBeat = currentScore;
                        bestMoment = tempConfig;
                    }
                }
            }

            extend(config, bestMoment || tempConfig);
        }

        function configFromObject(config) {
            if (config._d) {
                return;
            }

            var i = normalizeObjectUnits(config._i),
                dayOrDate = i.day === undefined ? i.date : i.day;
            config._a = map(
                [i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond],
                function (obj) {
                    return obj && parseInt(obj, 10);
                }
            );

            configFromArray(config);
        }

        function createFromConfig(config) {
            var res = new Moment(checkOverflow(prepareConfig(config)));
            if (res._nextDay) {
                // Adding is smart enough around DST
                res.add(1, 'd');
                res._nextDay = undefined;
            }

            return res;
        }

        function prepareConfig(config) {
            var input = config._i,
                format = config._f;

            config._locale = config._locale || getLocale(config._l);

            if (input === null || (format === undefined && input === '')) {
                return createInvalid({ nullInput: true });
            }

            if (typeof input === 'string') {
                config._i = input = config._locale.preparse(input);
            }

            if (isMoment(input)) {
                return new Moment(checkOverflow(input));
            } else if (isDate(input)) {
                config._d = input;
            } else if (isArray(format)) {
                configFromStringAndArray(config);
            } else if (format) {
                configFromStringAndFormat(config);
            } else {
                configFromInput(config);
            }

            if (!isValid(config)) {
                config._d = null;
            }

            return config;
        }

        function configFromInput(config) {
            var input = config._i;
            if (isUndefined(input)) {
                config._d = new Date(hooks.now());
            } else if (isDate(input)) {
                config._d = new Date(input.valueOf());
            } else if (typeof input === 'string') {
                configFromString(config);
            } else if (isArray(input)) {
                config._a = map(input.slice(0), function (obj) {
                    return parseInt(obj, 10);
                });
                configFromArray(config);
            } else if (isObject(input)) {
                configFromObject(config);
            } else if (isNumber(input)) {
                // from milliseconds
                config._d = new Date(input);
            } else {
                hooks.createFromInputFallback(config);
            }
        }

        function createLocalOrUTC(input, format, locale, strict, isUTC) {
            var c = {};

            if (format === true || format === false) {
                strict = format;
                format = undefined;
            }

            if (locale === true || locale === false) {
                strict = locale;
                locale = undefined;
            }

            if (
                (isObject(input) && isObjectEmpty(input)) ||
                (isArray(input) && input.length === 0)
            ) {
                input = undefined;
            }
            // object construction must be done this way.
            // https://github.com/moment/moment/issues/1423
            c._isAMomentObject = true;
            c._useUTC = c._isUTC = isUTC;
            c._l = locale;
            c._i = input;
            c._f = format;
            c._strict = strict;

            return createFromConfig(c);
        }

        function createLocal(input, format, locale, strict) {
            return createLocalOrUTC(input, format, locale, strict, false);
        }

        var prototypeMin = deprecate(
                'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
                function () {
                    var other = createLocal.apply(null, arguments);
                    if (this.isValid() && other.isValid()) {
                        return other < this ? this : other;
                    } else {
                        return createInvalid();
                    }
                }
            ),
            prototypeMax = deprecate(
                'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
                function () {
                    var other = createLocal.apply(null, arguments);
                    if (this.isValid() && other.isValid()) {
                        return other > this ? this : other;
                    } else {
                        return createInvalid();
                    }
                }
            );

        // Pick a moment m from moments so that m[fn](other) is true for all
        // other. This relies on the function fn to be transitive.
        //
        // moments should either be an array of moment objects or an array, whose
        // first element is an array of moment objects.
        function pickBy(fn, moments) {
            var res, i;
            if (moments.length === 1 && isArray(moments[0])) {
                moments = moments[0];
            }
            if (!moments.length) {
                return createLocal();
            }
            res = moments[0];
            for (i = 1; i < moments.length; ++i) {
                if (!moments[i].isValid() || moments[i][fn](res)) {
                    res = moments[i];
                }
            }
            return res;
        }

        // TODO: Use [].sort instead?
        function min() {
            var args = [].slice.call(arguments, 0);

            return pickBy('isBefore', args);
        }

        function max() {
            var args = [].slice.call(arguments, 0);

            return pickBy('isAfter', args);
        }

        var now = function () {
            return Date.now ? Date.now() : +new Date();
        };

        var ordering = [
            'year',
            'quarter',
            'month',
            'week',
            'day',
            'hour',
            'minute',
            'second',
            'millisecond',
        ];

        function isDurationValid(m) {
            var key,
                unitHasDecimal = false,
                i;
            for (key in m) {
                if (
                    hasOwnProp(m, key) &&
                    !(
                        indexOf.call(ordering, key) !== -1 &&
                        (m[key] == null || !isNaN(m[key]))
                    )
                ) {
                    return false;
                }
            }

            for (i = 0; i < ordering.length; ++i) {
                if (m[ordering[i]]) {
                    if (unitHasDecimal) {
                        return false; // only allow non-integers for smallest unit
                    }
                    if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                        unitHasDecimal = true;
                    }
                }
            }

            return true;
        }

        function isValid$1() {
            return this._isValid;
        }

        function createInvalid$1() {
            return createDuration(NaN);
        }

        function Duration(duration) {
            var normalizedInput = normalizeObjectUnits(duration),
                years = normalizedInput.year || 0,
                quarters = normalizedInput.quarter || 0,
                months = normalizedInput.month || 0,
                weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
                days = normalizedInput.day || 0,
                hours = normalizedInput.hour || 0,
                minutes = normalizedInput.minute || 0,
                seconds = normalizedInput.second || 0,
                milliseconds = normalizedInput.millisecond || 0;

            this._isValid = isDurationValid(normalizedInput);

            // representation for dateAddRemove
            this._milliseconds =
                +milliseconds +
                seconds * 1e3 + // 1000
                minutes * 6e4 + // 1000 * 60
                hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
            // Because of dateAddRemove treats 24 hours as different from a
            // day when working around DST, we need to store them separately
            this._days = +days + weeks * 7;
            // It is impossible to translate months into days without knowing
            // which months you are are talking about, so we have to store
            // it separately.
            this._months = +months + quarters * 3 + years * 12;

            this._data = {};

            this._locale = getLocale();

            this._bubble();
        }

        function isDuration(obj) {
            return obj instanceof Duration;
        }

        function absRound(number) {
            if (number < 0) {
                return Math.round(-1 * number) * -1;
            } else {
                return Math.round(number);
            }
        }

        // compare two arrays, return the number of differences
        function compareArrays(array1, array2, dontConvert) {
            var len = Math.min(array1.length, array2.length),
                lengthDiff = Math.abs(array1.length - array2.length),
                diffs = 0,
                i;
            for (i = 0; i < len; i++) {
                if (
                    (dontConvert && array1[i] !== array2[i]) ||
                    (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))
                ) {
                    diffs++;
                }
            }
            return diffs + lengthDiff;
        }

        // FORMATTING

        function offset(token, separator) {
            addFormatToken(token, 0, 0, function () {
                var offset = this.utcOffset(),
                    sign = '+';
                if (offset < 0) {
                    offset = -offset;
                    sign = '-';
                }
                return (
                    sign +
                    zeroFill(~~(offset / 60), 2) +
                    separator +
                    zeroFill(~~offset % 60, 2)
                );
            });
        }

        offset('Z', ':');
        offset('ZZ', '');

        // PARSING

        addRegexToken('Z', matchShortOffset);
        addRegexToken('ZZ', matchShortOffset);
        addParseToken(['Z', 'ZZ'], function (input, array, config) {
            config._useUTC = true;
            config._tzm = offsetFromString(matchShortOffset, input);
        });

        // HELPERS

        // timezone chunker
        // '+10:00' > ['10',  '00']
        // '-1530'  > ['-15', '30']
        var chunkOffset = /([\+\-]|\d\d)/gi;

        function offsetFromString(matcher, string) {
            var matches = (string || '').match(matcher),
                chunk,
                parts,
                minutes;

            if (matches === null) {
                return null;
            }

            chunk = matches[matches.length - 1] || [];
            parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
            minutes = +(parts[1] * 60) + toInt(parts[2]);

            return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
        }

        // Return a moment from input, that is local/utc/zone equivalent to model.
        function cloneWithOffset(input, model) {
            var res, diff;
            if (model._isUTC) {
                res = model.clone();
                diff =
                    (isMoment(input) || isDate(input)
                        ? input.valueOf()
                        : createLocal(input).valueOf()) - res.valueOf();
                // Use low-level api, because this fn is low-level api.
                res._d.setTime(res._d.valueOf() + diff);
                hooks.updateOffset(res, false);
                return res;
            } else {
                return createLocal(input).local();
            }
        }

        function getDateOffset(m) {
            // On Firefox.24 Date#getTimezoneOffset returns a floating point.
            // https://github.com/moment/moment/pull/1871
            return -Math.round(m._d.getTimezoneOffset());
        }

        // HOOKS

        // This function will be called whenever a moment is mutated.
        // It is intended to keep the offset in sync with the timezone.
        hooks.updateOffset = function () {};

        // MOMENTS

        // keepLocalTime = true means only change the timezone, without
        // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
        // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
        // +0200, so we adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        function getSetOffset(input, keepLocalTime, keepMinutes) {
            var offset = this._offset || 0,
                localAdjust;
            if (!this.isValid()) {
                return input != null ? this : NaN;
            }
            if (input != null) {
                if (typeof input === 'string') {
                    input = offsetFromString(matchShortOffset, input);
                    if (input === null) {
                        return this;
                    }
                } else if (Math.abs(input) < 16 && !keepMinutes) {
                    input = input * 60;
                }
                if (!this._isUTC && keepLocalTime) {
                    localAdjust = getDateOffset(this);
                }
                this._offset = input;
                this._isUTC = true;
                if (localAdjust != null) {
                    this.add(localAdjust, 'm');
                }
                if (offset !== input) {
                    if (!keepLocalTime || this._changeInProgress) {
                        addSubtract(
                            this,
                            createDuration(input - offset, 'm'),
                            1,
                            false
                        );
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        hooks.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }
                return this;
            } else {
                return this._isUTC ? offset : getDateOffset(this);
            }
        }

        function getSetZone(input, keepLocalTime) {
            if (input != null) {
                if (typeof input !== 'string') {
                    input = -input;
                }

                this.utcOffset(input, keepLocalTime);

                return this;
            } else {
                return -this.utcOffset();
            }
        }

        function setOffsetToUTC(keepLocalTime) {
            return this.utcOffset(0, keepLocalTime);
        }

        function setOffsetToLocal(keepLocalTime) {
            if (this._isUTC) {
                this.utcOffset(0, keepLocalTime);
                this._isUTC = false;

                if (keepLocalTime) {
                    this.subtract(getDateOffset(this), 'm');
                }
            }
            return this;
        }

        function setOffsetToParsedOffset() {
            if (this._tzm != null) {
                this.utcOffset(this._tzm, false, true);
            } else if (typeof this._i === 'string') {
                var tZone = offsetFromString(matchOffset, this._i);
                if (tZone != null) {
                    this.utcOffset(tZone);
                } else {
                    this.utcOffset(0, true);
                }
            }
            return this;
        }

        function hasAlignedHourOffset(input) {
            if (!this.isValid()) {
                return false;
            }
            input = input ? createLocal(input).utcOffset() : 0;

            return (this.utcOffset() - input) % 60 === 0;
        }

        function isDaylightSavingTime() {
            return (
                this.utcOffset() > this.clone().month(0).utcOffset() ||
                this.utcOffset() > this.clone().month(5).utcOffset()
            );
        }

        function isDaylightSavingTimeShifted() {
            if (!isUndefined(this._isDSTShifted)) {
                return this._isDSTShifted;
            }

            var c = {},
                other;

            copyConfig(c, this);
            c = prepareConfig(c);

            if (c._a) {
                other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
                this._isDSTShifted =
                    this.isValid() && compareArrays(c._a, other.toArray()) > 0;
            } else {
                this._isDSTShifted = false;
            }

            return this._isDSTShifted;
        }

        function isLocal() {
            return this.isValid() ? !this._isUTC : false;
        }

        function isUtcOffset() {
            return this.isValid() ? this._isUTC : false;
        }

        function isUtc() {
            return this.isValid() ? this._isUTC && this._offset === 0 : false;
        }

        // ASP.NET json date format regex
        var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
            // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
            // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
            // and further modified to allow for strings containing both week and day
            isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

        function createDuration(input, key) {
            var duration = input,
                // matching against regexp is expensive, do it on demand
                match = null,
                sign,
                ret,
                diffRes;

            if (isDuration(input)) {
                duration = {
                    ms: input._milliseconds,
                    d: input._days,
                    M: input._months,
                };
            } else if (isNumber(input) || !isNaN(+input)) {
                duration = {};
                if (key) {
                    duration[key] = +input;
                } else {
                    duration.milliseconds = +input;
                }
            } else if ((match = aspNetRegex.exec(input))) {
                sign = match[1] === '-' ? -1 : 1;
                duration = {
                    y: 0,
                    d: toInt(match[DATE]) * sign,
                    h: toInt(match[HOUR]) * sign,
                    m: toInt(match[MINUTE]) * sign,
                    s: toInt(match[SECOND]) * sign,
                    ms: toInt(absRound(match[MILLISECOND] * 1000)) * sign, // the millisecond decimal point is included in the match
                };
            } else if ((match = isoRegex.exec(input))) {
                sign = match[1] === '-' ? -1 : 1;
                duration = {
                    y: parseIso(match[2], sign),
                    M: parseIso(match[3], sign),
                    w: parseIso(match[4], sign),
                    d: parseIso(match[5], sign),
                    h: parseIso(match[6], sign),
                    m: parseIso(match[7], sign),
                    s: parseIso(match[8], sign),
                };
            } else if (duration == null) {
                // checks for null or undefined
                duration = {};
            } else if (
                typeof duration === 'object' &&
                ('from' in duration || 'to' in duration)
            ) {
                diffRes = momentsDifference(
                    createLocal(duration.from),
                    createLocal(duration.to)
                );

                duration = {};
                duration.ms = diffRes.milliseconds;
                duration.M = diffRes.months;
            }

            ret = new Duration(duration);

            if (isDuration(input) && hasOwnProp(input, '_locale')) {
                ret._locale = input._locale;
            }

            if (isDuration(input) && hasOwnProp(input, '_isValid')) {
                ret._isValid = input._isValid;
            }

            return ret;
        }

        createDuration.fn = Duration.prototype;
        createDuration.invalid = createInvalid$1;

        function parseIso(inp, sign) {
            // We'd normally use ~~inp for this, but unfortunately it also
            // converts floats to ints.
            // inp may be undefined, so careful calling replace on it.
            var res = inp && parseFloat(inp.replace(',', '.'));
            // apply sign while we're at it
            return (isNaN(res) ? 0 : res) * sign;
        }

        function positiveMomentsDifference(base, other) {
            var res = {};

            res.months =
                other.month() - base.month() + (other.year() - base.year()) * 12;
            if (base.clone().add(res.months, 'M').isAfter(other)) {
                --res.months;
            }

            res.milliseconds = +other - +base.clone().add(res.months, 'M');

            return res;
        }

        function momentsDifference(base, other) {
            var res;
            if (!(base.isValid() && other.isValid())) {
                return { milliseconds: 0, months: 0 };
            }

            other = cloneWithOffset(other, base);
            if (base.isBefore(other)) {
                res = positiveMomentsDifference(base, other);
            } else {
                res = positiveMomentsDifference(other, base);
                res.milliseconds = -res.milliseconds;
                res.months = -res.months;
            }

            return res;
        }

        // TODO: remove 'name' arg after deprecation is removed
        function createAdder(direction, name) {
            return function (val, period) {
                var dur, tmp;
                //invert the arguments, but complain about it
                if (period !== null && !isNaN(+period)) {
                    deprecateSimple(
                        name,
                        'moment().' +
                            name +
                            '(period, number) is deprecated. Please use moment().' +
                            name +
                            '(number, period). ' +
                            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.'
                    );
                    tmp = val;
                    val = period;
                    period = tmp;
                }

                dur = createDuration(val, period);
                addSubtract(this, dur, direction);
                return this;
            };
        }

        function addSubtract(mom, duration, isAdding, updateOffset) {
            var milliseconds = duration._milliseconds,
                days = absRound(duration._days),
                months = absRound(duration._months);

            if (!mom.isValid()) {
                // No op
                return;
            }

            updateOffset = updateOffset == null ? true : updateOffset;

            if (months) {
                setMonth(mom, get(mom, 'Month') + months * isAdding);
            }
            if (days) {
                set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
            }
            if (milliseconds) {
                mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
            }
            if (updateOffset) {
                hooks.updateOffset(mom, days || months);
            }
        }

        var add = createAdder(1, 'add'),
            subtract = createAdder(-1, 'subtract');

        function isString(input) {
            return typeof input === 'string' || input instanceof String;
        }

        // type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
        function isMomentInput(input) {
            return (
                isMoment(input) ||
                isDate(input) ||
                isString(input) ||
                isNumber(input) ||
                isNumberOrStringArray(input) ||
                isMomentInputObject(input) ||
                input === null ||
                input === undefined
            );
        }

        function isMomentInputObject(input) {
            var objectTest = isObject(input) && !isObjectEmpty(input),
                propertyTest = false,
                properties = [
                    'years',
                    'year',
                    'y',
                    'months',
                    'month',
                    'M',
                    'days',
                    'day',
                    'd',
                    'dates',
                    'date',
                    'D',
                    'hours',
                    'hour',
                    'h',
                    'minutes',
                    'minute',
                    'm',
                    'seconds',
                    'second',
                    's',
                    'milliseconds',
                    'millisecond',
                    'ms',
                ],
                i,
                property;

            for (i = 0; i < properties.length; i += 1) {
                property = properties[i];
                propertyTest = propertyTest || hasOwnProp(input, property);
            }

            return objectTest && propertyTest;
        }

        function isNumberOrStringArray(input) {
            var arrayTest = isArray(input),
                dataTypeTest = false;
            if (arrayTest) {
                dataTypeTest =
                    input.filter(function (item) {
                        return !isNumber(item) && isString(input);
                    }).length === 0;
            }
            return arrayTest && dataTypeTest;
        }

        function isCalendarSpec(input) {
            var objectTest = isObject(input) && !isObjectEmpty(input),
                propertyTest = false,
                properties = [
                    'sameDay',
                    'nextDay',
                    'lastDay',
                    'nextWeek',
                    'lastWeek',
                    'sameElse',
                ],
                i,
                property;

            for (i = 0; i < properties.length; i += 1) {
                property = properties[i];
                propertyTest = propertyTest || hasOwnProp(input, property);
            }

            return objectTest && propertyTest;
        }

        function getCalendarFormat(myMoment, now) {
            var diff = myMoment.diff(now, 'days', true);
            return diff < -6
                ? 'sameElse'
                : diff < -1
                ? 'lastWeek'
                : diff < 0
                ? 'lastDay'
                : diff < 1
                ? 'sameDay'
                : diff < 2
                ? 'nextDay'
                : diff < 7
                ? 'nextWeek'
                : 'sameElse';
        }

        function calendar$1(time, formats) {
            // Support for single parameter, formats only overload to the calendar function
            if (arguments.length === 1) {
                if (!arguments[0]) {
                    time = undefined;
                    formats = undefined;
                } else if (isMomentInput(arguments[0])) {
                    time = arguments[0];
                    formats = undefined;
                } else if (isCalendarSpec(arguments[0])) {
                    formats = arguments[0];
                    time = undefined;
                }
            }
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're local/utc/offset or not.
            var now = time || createLocal(),
                sod = cloneWithOffset(now, this).startOf('day'),
                format = hooks.calendarFormat(this, sod) || 'sameElse',
                output =
                    formats &&
                    (isFunction(formats[format])
                        ? formats[format].call(this, now)
                        : formats[format]);

            return this.format(
                output || this.localeData().calendar(format, this, createLocal(now))
            );
        }

        function clone() {
            return new Moment(this);
        }

        function isAfter(input, units) {
            var localInput = isMoment(input) ? input : createLocal(input);
            if (!(this.isValid() && localInput.isValid())) {
                return false;
            }
            units = normalizeUnits(units) || 'millisecond';
            if (units === 'millisecond') {
                return this.valueOf() > localInput.valueOf();
            } else {
                return localInput.valueOf() < this.clone().startOf(units).valueOf();
            }
        }

        function isBefore(input, units) {
            var localInput = isMoment(input) ? input : createLocal(input);
            if (!(this.isValid() && localInput.isValid())) {
                return false;
            }
            units = normalizeUnits(units) || 'millisecond';
            if (units === 'millisecond') {
                return this.valueOf() < localInput.valueOf();
            } else {
                return this.clone().endOf(units).valueOf() < localInput.valueOf();
            }
        }

        function isBetween(from, to, units, inclusivity) {
            var localFrom = isMoment(from) ? from : createLocal(from),
                localTo = isMoment(to) ? to : createLocal(to);
            if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
                return false;
            }
            inclusivity = inclusivity || '()';
            return (
                (inclusivity[0] === '('
                    ? this.isAfter(localFrom, units)
                    : !this.isBefore(localFrom, units)) &&
                (inclusivity[1] === ')'
                    ? this.isBefore(localTo, units)
                    : !this.isAfter(localTo, units))
            );
        }

        function isSame(input, units) {
            var localInput = isMoment(input) ? input : createLocal(input),
                inputMs;
            if (!(this.isValid() && localInput.isValid())) {
                return false;
            }
            units = normalizeUnits(units) || 'millisecond';
            if (units === 'millisecond') {
                return this.valueOf() === localInput.valueOf();
            } else {
                inputMs = localInput.valueOf();
                return (
                    this.clone().startOf(units).valueOf() <= inputMs &&
                    inputMs <= this.clone().endOf(units).valueOf()
                );
            }
        }

        function isSameOrAfter(input, units) {
            return this.isSame(input, units) || this.isAfter(input, units);
        }

        function isSameOrBefore(input, units) {
            return this.isSame(input, units) || this.isBefore(input, units);
        }

        function diff(input, units, asFloat) {
            var that, zoneDelta, output;

            if (!this.isValid()) {
                return NaN;
            }

            that = cloneWithOffset(input, this);

            if (!that.isValid()) {
                return NaN;
            }

            zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

            units = normalizeUnits(units);

            switch (units) {
                case 'year':
                    output = monthDiff(this, that) / 12;
                    break;
                case 'month':
                    output = monthDiff(this, that);
                    break;
                case 'quarter':
                    output = monthDiff(this, that) / 3;
                    break;
                case 'second':
                    output = (this - that) / 1e3;
                    break; // 1000
                case 'minute':
                    output = (this - that) / 6e4;
                    break; // 1000 * 60
                case 'hour':
                    output = (this - that) / 36e5;
                    break; // 1000 * 60 * 60
                case 'day':
                    output = (this - that - zoneDelta) / 864e5;
                    break; // 1000 * 60 * 60 * 24, negate dst
                case 'week':
                    output = (this - that - zoneDelta) / 6048e5;
                    break; // 1000 * 60 * 60 * 24 * 7, negate dst
                default:
                    output = this - that;
            }

            return asFloat ? output : absFloor(output);
        }

        function monthDiff(a, b) {
            if (a.date() < b.date()) {
                // end-of-month calculations work correct when the start month has more
                // days than the end month.
                return -monthDiff(b, a);
            }
            // difference in months
            var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
                // b is in (anchor - 1 month, anchor + 1 month)
                anchor = a.clone().add(wholeMonthDiff, 'months'),
                anchor2,
                adjust;

            if (b - anchor < 0) {
                anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
                // linear across the month
                adjust = (b - anchor) / (anchor - anchor2);
            } else {
                anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
                // linear across the month
                adjust = (b - anchor) / (anchor2 - anchor);
            }

            //check for negative zero, return zero if negative zero
            return -(wholeMonthDiff + adjust) || 0;
        }

        hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
        hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

        function toString() {
            return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        }

        function toISOString(keepOffset) {
            if (!this.isValid()) {
                return null;
            }
            var utc = keepOffset !== true,
                m = utc ? this.clone().utc() : this;
            if (m.year() < 0 || m.year() > 9999) {
                return formatMoment(
                    m,
                    utc
                        ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]'
                        : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ'
                );
            }
            if (isFunction(Date.prototype.toISOString)) {
                // native implementation is ~50x faster, use it when we can
                if (utc) {
                    return this.toDate().toISOString();
                } else {
                    return new Date(this.valueOf() + this.utcOffset() * 60 * 1000)
                        .toISOString()
                        .replace('Z', formatMoment(m, 'Z'));
                }
            }
            return formatMoment(
                m,
                utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ'
            );
        }

        /**
         * Return a human readable representation of a moment that can
         * also be evaluated to get a new moment which is the same
         *
         * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
         */
        function inspect() {
            if (!this.isValid()) {
                return 'moment.invalid(/* ' + this._i + ' */)';
            }
            var func = 'moment',
                zone = '',
                prefix,
                year,
                datetime,
                suffix;
            if (!this.isLocal()) {
                func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
                zone = 'Z';
            }
            prefix = '[' + func + '("]';
            year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
            datetime = '-MM-DD[T]HH:mm:ss.SSS';
            suffix = zone + '[")]';

            return this.format(prefix + year + datetime + suffix);
        }

        function format(inputString) {
            if (!inputString) {
                inputString = this.isUtc()
                    ? hooks.defaultFormatUtc
                    : hooks.defaultFormat;
            }
            var output = formatMoment(this, inputString);
            return this.localeData().postformat(output);
        }

        function from(time, withoutSuffix) {
            if (
                this.isValid() &&
                ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
            ) {
                return createDuration({ to: this, from: time })
                    .locale(this.locale())
                    .humanize(!withoutSuffix);
            } else {
                return this.localeData().invalidDate();
            }
        }

        function fromNow(withoutSuffix) {
            return this.from(createLocal(), withoutSuffix);
        }

        function to(time, withoutSuffix) {
            if (
                this.isValid() &&
                ((isMoment(time) && time.isValid()) || createLocal(time).isValid())
            ) {
                return createDuration({ from: this, to: time })
                    .locale(this.locale())
                    .humanize(!withoutSuffix);
            } else {
                return this.localeData().invalidDate();
            }
        }

        function toNow(withoutSuffix) {
            return this.to(createLocal(), withoutSuffix);
        }

        // If passed a locale key, it will set the locale for this
        // instance.  Otherwise, it will return the locale configuration
        // variables for this instance.
        function locale(key) {
            var newLocaleData;

            if (key === undefined) {
                return this._locale._abbr;
            } else {
                newLocaleData = getLocale(key);
                if (newLocaleData != null) {
                    this._locale = newLocaleData;
                }
                return this;
            }
        }

        var lang = deprecate(
            'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
            function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            }
        );

        function localeData() {
            return this._locale;
        }

        var MS_PER_SECOND = 1000,
            MS_PER_MINUTE = 60 * MS_PER_SECOND,
            MS_PER_HOUR = 60 * MS_PER_MINUTE,
            MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

        // actual modulo - handles negative numbers (for dates before 1970):
        function mod$1(dividend, divisor) {
            return ((dividend % divisor) + divisor) % divisor;
        }

        function localStartOfDate(y, m, d) {
            // the date constructor remaps years 0-99 to 1900-1999
            if (y < 100 && y >= 0) {
                // preserve leap years using a full 400 year cycle, then reset
                return new Date(y + 400, m, d) - MS_PER_400_YEARS;
            } else {
                return new Date(y, m, d).valueOf();
            }
        }

        function utcStartOfDate(y, m, d) {
            // Date.UTC remaps years 0-99 to 1900-1999
            if (y < 100 && y >= 0) {
                // preserve leap years using a full 400 year cycle, then reset
                return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
            } else {
                return Date.UTC(y, m, d);
            }
        }

        function startOf(units) {
            var time, startOfDate;
            units = normalizeUnits(units);
            if (units === undefined || units === 'millisecond' || !this.isValid()) {
                return this;
            }

            startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

            switch (units) {
                case 'year':
                    time = startOfDate(this.year(), 0, 1);
                    break;
                case 'quarter':
                    time = startOfDate(
                        this.year(),
                        this.month() - (this.month() % 3),
                        1
                    );
                    break;
                case 'month':
                    time = startOfDate(this.year(), this.month(), 1);
                    break;
                case 'week':
                    time = startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - this.weekday()
                    );
                    break;
                case 'isoWeek':
                    time = startOfDate(
                        this.year(),
                        this.month(),
                        this.date() - (this.isoWeekday() - 1)
                    );
                    break;
                case 'day':
                case 'date':
                    time = startOfDate(this.year(), this.month(), this.date());
                    break;
                case 'hour':
                    time = this._d.valueOf();
                    time -= mod$1(
                        time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                        MS_PER_HOUR
                    );
                    break;
                case 'minute':
                    time = this._d.valueOf();
                    time -= mod$1(time, MS_PER_MINUTE);
                    break;
                case 'second':
                    time = this._d.valueOf();
                    time -= mod$1(time, MS_PER_SECOND);
                    break;
            }

            this._d.setTime(time);
            hooks.updateOffset(this, true);
            return this;
        }

        function endOf(units) {
            var time, startOfDate;
            units = normalizeUnits(units);
            if (units === undefined || units === 'millisecond' || !this.isValid()) {
                return this;
            }

            startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

            switch (units) {
                case 'year':
                    time = startOfDate(this.year() + 1, 0, 1) - 1;
                    break;
                case 'quarter':
                    time =
                        startOfDate(
                            this.year(),
                            this.month() - (this.month() % 3) + 3,
                            1
                        ) - 1;
                    break;
                case 'month':
                    time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                    break;
                case 'week':
                    time =
                        startOfDate(
                            this.year(),
                            this.month(),
                            this.date() - this.weekday() + 7
                        ) - 1;
                    break;
                case 'isoWeek':
                    time =
                        startOfDate(
                            this.year(),
                            this.month(),
                            this.date() - (this.isoWeekday() - 1) + 7
                        ) - 1;
                    break;
                case 'day':
                case 'date':
                    time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                    break;
                case 'hour':
                    time = this._d.valueOf();
                    time +=
                        MS_PER_HOUR -
                        mod$1(
                            time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE),
                            MS_PER_HOUR
                        ) -
                        1;
                    break;
                case 'minute':
                    time = this._d.valueOf();
                    time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                    break;
                case 'second':
                    time = this._d.valueOf();
                    time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                    break;
            }

            this._d.setTime(time);
            hooks.updateOffset(this, true);
            return this;
        }

        function valueOf() {
            return this._d.valueOf() - (this._offset || 0) * 60000;
        }

        function unix() {
            return Math.floor(this.valueOf() / 1000);
        }

        function toDate() {
            return new Date(this.valueOf());
        }

        function toArray() {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hour(),
                m.minute(),
                m.second(),
                m.millisecond(),
            ];
        }

        function toObject() {
            var m = this;
            return {
                years: m.year(),
                months: m.month(),
                date: m.date(),
                hours: m.hours(),
                minutes: m.minutes(),
                seconds: m.seconds(),
                milliseconds: m.milliseconds(),
            };
        }

        function toJSON() {
            // new Date(NaN).toJSON() === null
            return this.isValid() ? this.toISOString() : null;
        }

        function isValid$2() {
            return isValid(this);
        }

        function parsingFlags() {
            return extend({}, getParsingFlags(this));
        }

        function invalidAt() {
            return getParsingFlags(this).overflow;
        }

        function creationData() {
            return {
                input: this._i,
                format: this._f,
                locale: this._locale,
                isUTC: this._isUTC,
                strict: this._strict,
            };
        }

        addFormatToken('N', 0, 0, 'eraAbbr');
        addFormatToken('NN', 0, 0, 'eraAbbr');
        addFormatToken('NNN', 0, 0, 'eraAbbr');
        addFormatToken('NNNN', 0, 0, 'eraName');
        addFormatToken('NNNNN', 0, 0, 'eraNarrow');

        addFormatToken('y', ['y', 1], 'yo', 'eraYear');
        addFormatToken('y', ['yy', 2], 0, 'eraYear');
        addFormatToken('y', ['yyy', 3], 0, 'eraYear');
        addFormatToken('y', ['yyyy', 4], 0, 'eraYear');

        addRegexToken('N', matchEraAbbr);
        addRegexToken('NN', matchEraAbbr);
        addRegexToken('NNN', matchEraAbbr);
        addRegexToken('NNNN', matchEraName);
        addRegexToken('NNNNN', matchEraNarrow);

        addParseToken(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (
            input,
            array,
            config,
            token
        ) {
            var era = config._locale.erasParse(input, token, config._strict);
            if (era) {
                getParsingFlags(config).era = era;
            } else {
                getParsingFlags(config).invalidEra = input;
            }
        });

        addRegexToken('y', matchUnsigned);
        addRegexToken('yy', matchUnsigned);
        addRegexToken('yyy', matchUnsigned);
        addRegexToken('yyyy', matchUnsigned);
        addRegexToken('yo', matchEraYearOrdinal);

        addParseToken(['y', 'yy', 'yyy', 'yyyy'], YEAR);
        addParseToken(['yo'], function (input, array, config, token) {
            var match;
            if (config._locale._eraYearOrdinalRegex) {
                match = input.match(config._locale._eraYearOrdinalRegex);
            }

            if (config._locale.eraYearOrdinalParse) {
                array[YEAR] = config._locale.eraYearOrdinalParse(input, match);
            } else {
                array[YEAR] = parseInt(input, 10);
            }
        });

        function localeEras(m, format) {
            var i,
                l,
                date,
                eras = this._eras || getLocale('en')._eras;
            for (i = 0, l = eras.length; i < l; ++i) {
                switch (typeof eras[i].since) {
                    case 'string':
                        // truncate time
                        date = hooks(eras[i].since).startOf('day');
                        eras[i].since = date.valueOf();
                        break;
                }

                switch (typeof eras[i].until) {
                    case 'undefined':
                        eras[i].until = +Infinity;
                        break;
                    case 'string':
                        // truncate time
                        date = hooks(eras[i].until).startOf('day').valueOf();
                        eras[i].until = date.valueOf();
                        break;
                }
            }
            return eras;
        }

        function localeErasParse(eraName, format, strict) {
            var i,
                l,
                eras = this.eras(),
                name,
                abbr,
                narrow;
            eraName = eraName.toUpperCase();

            for (i = 0, l = eras.length; i < l; ++i) {
                name = eras[i].name.toUpperCase();
                abbr = eras[i].abbr.toUpperCase();
                narrow = eras[i].narrow.toUpperCase();

                if (strict) {
                    switch (format) {
                        case 'N':
                        case 'NN':
                        case 'NNN':
                            if (abbr === eraName) {
                                return eras[i];
                            }
                            break;

                        case 'NNNN':
                            if (name === eraName) {
                                return eras[i];
                            }
                            break;

                        case 'NNNNN':
                            if (narrow === eraName) {
                                return eras[i];
                            }
                            break;
                    }
                } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
                    return eras[i];
                }
            }
        }

        function localeErasConvertYear(era, year) {
            var dir = era.since <= era.until ? +1 : -1;
            if (year === undefined) {
                return hooks(era.since).year();
            } else {
                return hooks(era.since).year() + (year - era.offset) * dir;
            }
        }

        function getEraName() {
            var i,
                l,
                val,
                eras = this.localeData().eras();
            for (i = 0, l = eras.length; i < l; ++i) {
                // truncate time
                val = this.clone().startOf('day').valueOf();

                if (eras[i].since <= val && val <= eras[i].until) {
                    return eras[i].name;
                }
                if (eras[i].until <= val && val <= eras[i].since) {
                    return eras[i].name;
                }
            }

            return '';
        }

        function getEraNarrow() {
            var i,
                l,
                val,
                eras = this.localeData().eras();
            for (i = 0, l = eras.length; i < l; ++i) {
                // truncate time
                val = this.clone().startOf('day').valueOf();

                if (eras[i].since <= val && val <= eras[i].until) {
                    return eras[i].narrow;
                }
                if (eras[i].until <= val && val <= eras[i].since) {
                    return eras[i].narrow;
                }
            }

            return '';
        }

        function getEraAbbr() {
            var i,
                l,
                val,
                eras = this.localeData().eras();
            for (i = 0, l = eras.length; i < l; ++i) {
                // truncate time
                val = this.clone().startOf('day').valueOf();

                if (eras[i].since <= val && val <= eras[i].until) {
                    return eras[i].abbr;
                }
                if (eras[i].until <= val && val <= eras[i].since) {
                    return eras[i].abbr;
                }
            }

            return '';
        }

        function getEraYear() {
            var i,
                l,
                dir,
                val,
                eras = this.localeData().eras();
            for (i = 0, l = eras.length; i < l; ++i) {
                dir = eras[i].since <= eras[i].until ? +1 : -1;

                // truncate time
                val = this.clone().startOf('day').valueOf();

                if (
                    (eras[i].since <= val && val <= eras[i].until) ||
                    (eras[i].until <= val && val <= eras[i].since)
                ) {
                    return (
                        (this.year() - hooks(eras[i].since).year()) * dir +
                        eras[i].offset
                    );
                }
            }

            return this.year();
        }

        function erasNameRegex(isStrict) {
            if (!hasOwnProp(this, '_erasNameRegex')) {
                computeErasParse.call(this);
            }
            return isStrict ? this._erasNameRegex : this._erasRegex;
        }

        function erasAbbrRegex(isStrict) {
            if (!hasOwnProp(this, '_erasAbbrRegex')) {
                computeErasParse.call(this);
            }
            return isStrict ? this._erasAbbrRegex : this._erasRegex;
        }

        function erasNarrowRegex(isStrict) {
            if (!hasOwnProp(this, '_erasNarrowRegex')) {
                computeErasParse.call(this);
            }
            return isStrict ? this._erasNarrowRegex : this._erasRegex;
        }

        function matchEraAbbr(isStrict, locale) {
            return locale.erasAbbrRegex(isStrict);
        }

        function matchEraName(isStrict, locale) {
            return locale.erasNameRegex(isStrict);
        }

        function matchEraNarrow(isStrict, locale) {
            return locale.erasNarrowRegex(isStrict);
        }

        function matchEraYearOrdinal(isStrict, locale) {
            return locale._eraYearOrdinalRegex || matchUnsigned;
        }

        function computeErasParse() {
            var abbrPieces = [],
                namePieces = [],
                narrowPieces = [],
                mixedPieces = [],
                i,
                l,
                eras = this.eras();

            for (i = 0, l = eras.length; i < l; ++i) {
                namePieces.push(regexEscape(eras[i].name));
                abbrPieces.push(regexEscape(eras[i].abbr));
                narrowPieces.push(regexEscape(eras[i].narrow));

                mixedPieces.push(regexEscape(eras[i].name));
                mixedPieces.push(regexEscape(eras[i].abbr));
                mixedPieces.push(regexEscape(eras[i].narrow));
            }

            this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
            this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
            this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
            this._erasNarrowRegex = new RegExp(
                '^(' + narrowPieces.join('|') + ')',
                'i'
            );
        }

        // FORMATTING

        addFormatToken(0, ['gg', 2], 0, function () {
            return this.weekYear() % 100;
        });

        addFormatToken(0, ['GG', 2], 0, function () {
            return this.isoWeekYear() % 100;
        });

        function addWeekYearFormatToken(token, getter) {
            addFormatToken(0, [token, token.length], 0, getter);
        }

        addWeekYearFormatToken('gggg', 'weekYear');
        addWeekYearFormatToken('ggggg', 'weekYear');
        addWeekYearFormatToken('GGGG', 'isoWeekYear');
        addWeekYearFormatToken('GGGGG', 'isoWeekYear');

        // ALIASES

        addUnitAlias('weekYear', 'gg');
        addUnitAlias('isoWeekYear', 'GG');

        // PRIORITY

        addUnitPriority('weekYear', 1);
        addUnitPriority('isoWeekYear', 1);

        // PARSING

        addRegexToken('G', matchSigned);
        addRegexToken('g', matchSigned);
        addRegexToken('GG', match1to2, match2);
        addRegexToken('gg', match1to2, match2);
        addRegexToken('GGGG', match1to4, match4);
        addRegexToken('gggg', match1to4, match4);
        addRegexToken('GGGGG', match1to6, match6);
        addRegexToken('ggggg', match1to6, match6);

        addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (
            input,
            week,
            config,
            token
        ) {
            week[token.substr(0, 2)] = toInt(input);
        });

        addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
            week[token] = hooks.parseTwoDigitYear(input);
        });

        // MOMENTS

        function getSetWeekYear(input) {
            return getSetWeekYearHelper.call(
                this,
                input,
                this.week(),
                this.weekday(),
                this.localeData()._week.dow,
                this.localeData()._week.doy
            );
        }

        function getSetISOWeekYear(input) {
            return getSetWeekYearHelper.call(
                this,
                input,
                this.isoWeek(),
                this.isoWeekday(),
                1,
                4
            );
        }

        function getISOWeeksInYear() {
            return weeksInYear(this.year(), 1, 4);
        }

        function getISOWeeksInISOWeekYear() {
            return weeksInYear(this.isoWeekYear(), 1, 4);
        }

        function getWeeksInYear() {
            var weekInfo = this.localeData()._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        }

        function getWeeksInWeekYear() {
            var weekInfo = this.localeData()._week;
            return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
        }

        function getSetWeekYearHelper(input, week, weekday, dow, doy) {
            var weeksTarget;
            if (input == null) {
                return weekOfYear(this, dow, doy).year;
            } else {
                weeksTarget = weeksInYear(input, dow, doy);
                if (week > weeksTarget) {
                    week = weeksTarget;
                }
                return setWeekAll.call(this, input, week, weekday, dow, doy);
            }
        }

        function setWeekAll(weekYear, week, weekday, dow, doy) {
            var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
                date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

            this.year(date.getUTCFullYear());
            this.month(date.getUTCMonth());
            this.date(date.getUTCDate());
            return this;
        }

        // FORMATTING

        addFormatToken('Q', 0, 'Qo', 'quarter');

        // ALIASES

        addUnitAlias('quarter', 'Q');

        // PRIORITY

        addUnitPriority('quarter', 7);

        // PARSING

        addRegexToken('Q', match1);
        addParseToken('Q', function (input, array) {
            array[MONTH] = (toInt(input) - 1) * 3;
        });

        // MOMENTS

        function getSetQuarter(input) {
            return input == null
                ? Math.ceil((this.month() + 1) / 3)
                : this.month((input - 1) * 3 + (this.month() % 3));
        }

        // FORMATTING

        addFormatToken('D', ['DD', 2], 'Do', 'date');

        // ALIASES

        addUnitAlias('date', 'D');

        // PRIORITY
        addUnitPriority('date', 9);

        // PARSING

        addRegexToken('D', match1to2);
        addRegexToken('DD', match1to2, match2);
        addRegexToken('Do', function (isStrict, locale) {
            // TODO: Remove "ordinalParse" fallback in next major release.
            return isStrict
                ? locale._dayOfMonthOrdinalParse || locale._ordinalParse
                : locale._dayOfMonthOrdinalParseLenient;
        });

        addParseToken(['D', 'DD'], DATE);
        addParseToken('Do', function (input, array) {
            array[DATE] = toInt(input.match(match1to2)[0]);
        });

        // MOMENTS

        var getSetDayOfMonth = makeGetSet('Date', true);

        // FORMATTING

        addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

        // ALIASES

        addUnitAlias('dayOfYear', 'DDD');

        // PRIORITY
        addUnitPriority('dayOfYear', 4);

        // PARSING

        addRegexToken('DDD', match1to3);
        addRegexToken('DDDD', match3);
        addParseToken(['DDD', 'DDDD'], function (input, array, config) {
            config._dayOfYear = toInt(input);
        });

        // HELPERS

        // MOMENTS

        function getSetDayOfYear(input) {
            var dayOfYear =
                Math.round(
                    (this.clone().startOf('day') - this.clone().startOf('year')) / 864e5
                ) + 1;
            return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
        }

        // FORMATTING

        addFormatToken('m', ['mm', 2], 0, 'minute');

        // ALIASES

        addUnitAlias('minute', 'm');

        // PRIORITY

        addUnitPriority('minute', 14);

        // PARSING

        addRegexToken('m', match1to2);
        addRegexToken('mm', match1to2, match2);
        addParseToken(['m', 'mm'], MINUTE);

        // MOMENTS

        var getSetMinute = makeGetSet('Minutes', false);

        // FORMATTING

        addFormatToken('s', ['ss', 2], 0, 'second');

        // ALIASES

        addUnitAlias('second', 's');

        // PRIORITY

        addUnitPriority('second', 15);

        // PARSING

        addRegexToken('s', match1to2);
        addRegexToken('ss', match1to2, match2);
        addParseToken(['s', 'ss'], SECOND);

        // MOMENTS

        var getSetSecond = makeGetSet('Seconds', false);

        // FORMATTING

        addFormatToken('S', 0, 0, function () {
            return ~~(this.millisecond() / 100);
        });

        addFormatToken(0, ['SS', 2], 0, function () {
            return ~~(this.millisecond() / 10);
        });

        addFormatToken(0, ['SSS', 3], 0, 'millisecond');
        addFormatToken(0, ['SSSS', 4], 0, function () {
            return this.millisecond() * 10;
        });
        addFormatToken(0, ['SSSSS', 5], 0, function () {
            return this.millisecond() * 100;
        });
        addFormatToken(0, ['SSSSSS', 6], 0, function () {
            return this.millisecond() * 1000;
        });
        addFormatToken(0, ['SSSSSSS', 7], 0, function () {
            return this.millisecond() * 10000;
        });
        addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
            return this.millisecond() * 100000;
        });
        addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
            return this.millisecond() * 1000000;
        });

        // ALIASES

        addUnitAlias('millisecond', 'ms');

        // PRIORITY

        addUnitPriority('millisecond', 16);

        // PARSING

        addRegexToken('S', match1to3, match1);
        addRegexToken('SS', match1to3, match2);
        addRegexToken('SSS', match1to3, match3);

        var token, getSetMillisecond;
        for (token = 'SSSS'; token.length <= 9; token += 'S') {
            addRegexToken(token, matchUnsigned);
        }

        function parseMs(input, array) {
            array[MILLISECOND] = toInt(('0.' + input) * 1000);
        }

        for (token = 'S'; token.length <= 9; token += 'S') {
            addParseToken(token, parseMs);
        }

        getSetMillisecond = makeGetSet('Milliseconds', false);

        // FORMATTING

        addFormatToken('z', 0, 0, 'zoneAbbr');
        addFormatToken('zz', 0, 0, 'zoneName');

        // MOMENTS

        function getZoneAbbr() {
            return this._isUTC ? 'UTC' : '';
        }

        function getZoneName() {
            return this._isUTC ? 'Coordinated Universal Time' : '';
        }

        var proto = Moment.prototype;

        proto.add = add;
        proto.calendar = calendar$1;
        proto.clone = clone;
        proto.diff = diff;
        proto.endOf = endOf;
        proto.format = format;
        proto.from = from;
        proto.fromNow = fromNow;
        proto.to = to;
        proto.toNow = toNow;
        proto.get = stringGet;
        proto.invalidAt = invalidAt;
        proto.isAfter = isAfter;
        proto.isBefore = isBefore;
        proto.isBetween = isBetween;
        proto.isSame = isSame;
        proto.isSameOrAfter = isSameOrAfter;
        proto.isSameOrBefore = isSameOrBefore;
        proto.isValid = isValid$2;
        proto.lang = lang;
        proto.locale = locale;
        proto.localeData = localeData;
        proto.max = prototypeMax;
        proto.min = prototypeMin;
        proto.parsingFlags = parsingFlags;
        proto.set = stringSet;
        proto.startOf = startOf;
        proto.subtract = subtract;
        proto.toArray = toArray;
        proto.toObject = toObject;
        proto.toDate = toDate;
        proto.toISOString = toISOString;
        proto.inspect = inspect;
        if (typeof Symbol !== 'undefined' && Symbol.for != null) {
            proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
                return 'Moment<' + this.format() + '>';
            };
        }
        proto.toJSON = toJSON;
        proto.toString = toString;
        proto.unix = unix;
        proto.valueOf = valueOf;
        proto.creationData = creationData;
        proto.eraName = getEraName;
        proto.eraNarrow = getEraNarrow;
        proto.eraAbbr = getEraAbbr;
        proto.eraYear = getEraYear;
        proto.year = getSetYear;
        proto.isLeapYear = getIsLeapYear;
        proto.weekYear = getSetWeekYear;
        proto.isoWeekYear = getSetISOWeekYear;
        proto.quarter = proto.quarters = getSetQuarter;
        proto.month = getSetMonth;
        proto.daysInMonth = getDaysInMonth;
        proto.week = proto.weeks = getSetWeek;
        proto.isoWeek = proto.isoWeeks = getSetISOWeek;
        proto.weeksInYear = getWeeksInYear;
        proto.weeksInWeekYear = getWeeksInWeekYear;
        proto.isoWeeksInYear = getISOWeeksInYear;
        proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
        proto.date = getSetDayOfMonth;
        proto.day = proto.days = getSetDayOfWeek;
        proto.weekday = getSetLocaleDayOfWeek;
        proto.isoWeekday = getSetISODayOfWeek;
        proto.dayOfYear = getSetDayOfYear;
        proto.hour = proto.hours = getSetHour;
        proto.minute = proto.minutes = getSetMinute;
        proto.second = proto.seconds = getSetSecond;
        proto.millisecond = proto.milliseconds = getSetMillisecond;
        proto.utcOffset = getSetOffset;
        proto.utc = setOffsetToUTC;
        proto.local = setOffsetToLocal;
        proto.parseZone = setOffsetToParsedOffset;
        proto.hasAlignedHourOffset = hasAlignedHourOffset;
        proto.isDST = isDaylightSavingTime;
        proto.isLocal = isLocal;
        proto.isUtcOffset = isUtcOffset;
        proto.isUtc = isUtc;
        proto.isUTC = isUtc;
        proto.zoneAbbr = getZoneAbbr;
        proto.zoneName = getZoneName;
        proto.dates = deprecate(
            'dates accessor is deprecated. Use date instead.',
            getSetDayOfMonth
        );
        proto.months = deprecate(
            'months accessor is deprecated. Use month instead',
            getSetMonth
        );
        proto.years = deprecate(
            'years accessor is deprecated. Use year instead',
            getSetYear
        );
        proto.zone = deprecate(
            'moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',
            getSetZone
        );
        proto.isDSTShifted = deprecate(
            'isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',
            isDaylightSavingTimeShifted
        );

        function createUnix(input) {
            return createLocal(input * 1000);
        }

        function createInZone() {
            return createLocal.apply(null, arguments).parseZone();
        }

        function preParsePostFormat(string) {
            return string;
        }

        var proto$1 = Locale.prototype;

        proto$1.calendar = calendar;
        proto$1.longDateFormat = longDateFormat;
        proto$1.invalidDate = invalidDate;
        proto$1.ordinal = ordinal;
        proto$1.preparse = preParsePostFormat;
        proto$1.postformat = preParsePostFormat;
        proto$1.relativeTime = relativeTime;
        proto$1.pastFuture = pastFuture;
        proto$1.set = set;
        proto$1.eras = localeEras;
        proto$1.erasParse = localeErasParse;
        proto$1.erasConvertYear = localeErasConvertYear;
        proto$1.erasAbbrRegex = erasAbbrRegex;
        proto$1.erasNameRegex = erasNameRegex;
        proto$1.erasNarrowRegex = erasNarrowRegex;

        proto$1.months = localeMonths;
        proto$1.monthsShort = localeMonthsShort;
        proto$1.monthsParse = localeMonthsParse;
        proto$1.monthsRegex = monthsRegex;
        proto$1.monthsShortRegex = monthsShortRegex;
        proto$1.week = localeWeek;
        proto$1.firstDayOfYear = localeFirstDayOfYear;
        proto$1.firstDayOfWeek = localeFirstDayOfWeek;

        proto$1.weekdays = localeWeekdays;
        proto$1.weekdaysMin = localeWeekdaysMin;
        proto$1.weekdaysShort = localeWeekdaysShort;
        proto$1.weekdaysParse = localeWeekdaysParse;

        proto$1.weekdaysRegex = weekdaysRegex;
        proto$1.weekdaysShortRegex = weekdaysShortRegex;
        proto$1.weekdaysMinRegex = weekdaysMinRegex;

        proto$1.isPM = localeIsPM;
        proto$1.meridiem = localeMeridiem;

        function get$1(format, index, field, setter) {
            var locale = getLocale(),
                utc = createUTC().set(setter, index);
            return locale[field](utc, format);
        }

        function listMonthsImpl(format, index, field) {
            if (isNumber(format)) {
                index = format;
                format = undefined;
            }

            format = format || '';

            if (index != null) {
                return get$1(format, index, field, 'month');
            }

            var i,
                out = [];
            for (i = 0; i < 12; i++) {
                out[i] = get$1(format, i, field, 'month');
            }
            return out;
        }

        // ()
        // (5)
        // (fmt, 5)
        // (fmt)
        // (true)
        // (true, 5)
        // (true, fmt, 5)
        // (true, fmt)
        function listWeekdaysImpl(localeSorted, format, index, field) {
            if (typeof localeSorted === 'boolean') {
                if (isNumber(format)) {
                    index = format;
                    format = undefined;
                }

                format = format || '';
            } else {
                format = localeSorted;
                index = format;
                localeSorted = false;

                if (isNumber(format)) {
                    index = format;
                    format = undefined;
                }

                format = format || '';
            }

            var locale = getLocale(),
                shift = localeSorted ? locale._week.dow : 0,
                i,
                out = [];

            if (index != null) {
                return get$1(format, (index + shift) % 7, field, 'day');
            }

            for (i = 0; i < 7; i++) {
                out[i] = get$1(format, (i + shift) % 7, field, 'day');
            }
            return out;
        }

        function listMonths(format, index) {
            return listMonthsImpl(format, index, 'months');
        }

        function listMonthsShort(format, index) {
            return listMonthsImpl(format, index, 'monthsShort');
        }

        function listWeekdays(localeSorted, format, index) {
            return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
        }

        function listWeekdaysShort(localeSorted, format, index) {
            return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
        }

        function listWeekdaysMin(localeSorted, format, index) {
            return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
        }

        getSetGlobalLocale('en', {
            eras: [
                {
                    since: '0001-01-01',
                    until: +Infinity,
                    offset: 1,
                    name: 'Anno Domini',
                    narrow: 'AD',
                    abbr: 'AD',
                },
                {
                    since: '0000-12-31',
                    until: -Infinity,
                    offset: 1,
                    name: 'Before Christ',
                    narrow: 'BC',
                    abbr: 'BC',
                },
            ],
            dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
            ordinal: function (number) {
                var b = number % 10,
                    output =
                        toInt((number % 100) / 10) === 1
                            ? 'th'
                            : b === 1
                            ? 'st'
                            : b === 2
                            ? 'nd'
                            : b === 3
                            ? 'rd'
                            : 'th';
                return number + output;
            },
        });

        // Side effect imports

        hooks.lang = deprecate(
            'moment.lang is deprecated. Use moment.locale instead.',
            getSetGlobalLocale
        );
        hooks.langData = deprecate(
            'moment.langData is deprecated. Use moment.localeData instead.',
            getLocale
        );

        var mathAbs = Math.abs;

        function abs() {
            var data = this._data;

            this._milliseconds = mathAbs(this._milliseconds);
            this._days = mathAbs(this._days);
            this._months = mathAbs(this._months);

            data.milliseconds = mathAbs(data.milliseconds);
            data.seconds = mathAbs(data.seconds);
            data.minutes = mathAbs(data.minutes);
            data.hours = mathAbs(data.hours);
            data.months = mathAbs(data.months);
            data.years = mathAbs(data.years);

            return this;
        }

        function addSubtract$1(duration, input, value, direction) {
            var other = createDuration(input, value);

            duration._milliseconds += direction * other._milliseconds;
            duration._days += direction * other._days;
            duration._months += direction * other._months;

            return duration._bubble();
        }

        // supports only 2.0-style add(1, 's') or add(duration)
        function add$1(input, value) {
            return addSubtract$1(this, input, value, 1);
        }

        // supports only 2.0-style subtract(1, 's') or subtract(duration)
        function subtract$1(input, value) {
            return addSubtract$1(this, input, value, -1);
        }

        function absCeil(number) {
            if (number < 0) {
                return Math.floor(number);
            } else {
                return Math.ceil(number);
            }
        }

        function bubble() {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds,
                minutes,
                hours,
                years,
                monthsFromDays;

            // if we have a mix of positive and negative values, bubble down first
            // check: https://github.com/moment/moment/issues/2166
            if (
                !(
                    (milliseconds >= 0 && days >= 0 && months >= 0) ||
                    (milliseconds <= 0 && days <= 0 && months <= 0)
                )
            ) {
                milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
                days = 0;
                months = 0;
            }

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absFloor(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absFloor(seconds / 60);
            data.minutes = minutes % 60;

            hours = absFloor(minutes / 60);
            data.hours = hours % 24;

            days += absFloor(hours / 24);

            // convert days to months
            monthsFromDays = absFloor(daysToMonths(days));
            months += monthsFromDays;
            days -= absCeil(monthsToDays(monthsFromDays));

            // 12 months -> 1 year
            years = absFloor(months / 12);
            months %= 12;

            data.days = days;
            data.months = months;
            data.years = years;

            return this;
        }

        function daysToMonths(days) {
            // 400 years have 146097 days (taking into account leap year rules)
            // 400 years have 12 months === 4800
            return (days * 4800) / 146097;
        }

        function monthsToDays(months) {
            // the reverse of daysToMonths
            return (months * 146097) / 4800;
        }

        function as(units) {
            if (!this.isValid()) {
                return NaN;
            }
            var days,
                months,
                milliseconds = this._milliseconds;

            units = normalizeUnits(units);

            if (units === 'month' || units === 'quarter' || units === 'year') {
                days = this._days + milliseconds / 864e5;
                months = this._months + daysToMonths(days);
                switch (units) {
                    case 'month':
                        return months;
                    case 'quarter':
                        return months / 3;
                    case 'year':
                        return months / 12;
                }
            } else {
                // handle milliseconds separately because of floating point math errors (issue #1867)
                days = this._days + Math.round(monthsToDays(this._months));
                switch (units) {
                    case 'week':
                        return days / 7 + milliseconds / 6048e5;
                    case 'day':
                        return days + milliseconds / 864e5;
                    case 'hour':
                        return days * 24 + milliseconds / 36e5;
                    case 'minute':
                        return days * 1440 + milliseconds / 6e4;
                    case 'second':
                        return days * 86400 + milliseconds / 1000;
                    // Math.floor prevents floating point math errors here
                    case 'millisecond':
                        return Math.floor(days * 864e5) + milliseconds;
                    default:
                        throw new Error('Unknown unit ' + units);
                }
            }
        }

        // TODO: Use this.as('ms')?
        function valueOf$1() {
            if (!this.isValid()) {
                return NaN;
            }
            return (
                this._milliseconds +
                this._days * 864e5 +
                (this._months % 12) * 2592e6 +
                toInt(this._months / 12) * 31536e6
            );
        }

        function makeAs(alias) {
            return function () {
                return this.as(alias);
            };
        }

        var asMilliseconds = makeAs('ms'),
            asSeconds = makeAs('s'),
            asMinutes = makeAs('m'),
            asHours = makeAs('h'),
            asDays = makeAs('d'),
            asWeeks = makeAs('w'),
            asMonths = makeAs('M'),
            asQuarters = makeAs('Q'),
            asYears = makeAs('y');

        function clone$1() {
            return createDuration(this);
        }

        function get$2(units) {
            units = normalizeUnits(units);
            return this.isValid() ? this[units + 's']() : NaN;
        }

        function makeGetter(name) {
            return function () {
                return this.isValid() ? this._data[name] : NaN;
            };
        }

        var milliseconds = makeGetter('milliseconds'),
            seconds = makeGetter('seconds'),
            minutes = makeGetter('minutes'),
            hours = makeGetter('hours'),
            days = makeGetter('days'),
            months = makeGetter('months'),
            years = makeGetter('years');

        function weeks() {
            return absFloor(this.days() / 7);
        }

        var round = Math.round,
            thresholds = {
                ss: 44, // a few seconds to seconds
                s: 45, // seconds to minute
                m: 45, // minutes to hour
                h: 22, // hours to day
                d: 26, // days to month/week
                w: null, // weeks to month
                M: 11, // months to year
            };

        // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
        function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
            return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
        }

        function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
            var duration = createDuration(posNegDuration).abs(),
                seconds = round(duration.as('s')),
                minutes = round(duration.as('m')),
                hours = round(duration.as('h')),
                days = round(duration.as('d')),
                months = round(duration.as('M')),
                weeks = round(duration.as('w')),
                years = round(duration.as('y')),
                a =
                    (seconds <= thresholds.ss && ['s', seconds]) ||
                    (seconds < thresholds.s && ['ss', seconds]) ||
                    (minutes <= 1 && ['m']) ||
                    (minutes < thresholds.m && ['mm', minutes]) ||
                    (hours <= 1 && ['h']) ||
                    (hours < thresholds.h && ['hh', hours]) ||
                    (days <= 1 && ['d']) ||
                    (days < thresholds.d && ['dd', days]);

            if (thresholds.w != null) {
                a =
                    a ||
                    (weeks <= 1 && ['w']) ||
                    (weeks < thresholds.w && ['ww', weeks]);
            }
            a = a ||
                (months <= 1 && ['M']) ||
                (months < thresholds.M && ['MM', months]) ||
                (years <= 1 && ['y']) || ['yy', years];

            a[2] = withoutSuffix;
            a[3] = +posNegDuration > 0;
            a[4] = locale;
            return substituteTimeAgo.apply(null, a);
        }

        // This function allows you to set the rounding function for relative time strings
        function getSetRelativeTimeRounding(roundingFunction) {
            if (roundingFunction === undefined) {
                return round;
            }
            if (typeof roundingFunction === 'function') {
                round = roundingFunction;
                return true;
            }
            return false;
        }

        // This function allows you to set a threshold for relative time strings
        function getSetRelativeTimeThreshold(threshold, limit) {
            if (thresholds[threshold] === undefined) {
                return false;
            }
            if (limit === undefined) {
                return thresholds[threshold];
            }
            thresholds[threshold] = limit;
            if (threshold === 's') {
                thresholds.ss = limit - 1;
            }
            return true;
        }

        function humanize(argWithSuffix, argThresholds) {
            if (!this.isValid()) {
                return this.localeData().invalidDate();
            }

            var withSuffix = false,
                th = thresholds,
                locale,
                output;

            if (typeof argWithSuffix === 'object') {
                argThresholds = argWithSuffix;
                argWithSuffix = false;
            }
            if (typeof argWithSuffix === 'boolean') {
                withSuffix = argWithSuffix;
            }
            if (typeof argThresholds === 'object') {
                th = Object.assign({}, thresholds, argThresholds);
                if (argThresholds.s != null && argThresholds.ss == null) {
                    th.ss = argThresholds.s - 1;
                }
            }

            locale = this.localeData();
            output = relativeTime$1(this, !withSuffix, th, locale);

            if (withSuffix) {
                output = locale.pastFuture(+this, output);
            }

            return locale.postformat(output);
        }

        var abs$1 = Math.abs;

        function sign(x) {
            return (x > 0) - (x < 0) || +x;
        }

        function toISOString$1() {
            // for ISO strings we do not use the normal bubbling rules:
            //  * milliseconds bubble up until they become hours
            //  * days do not bubble at all
            //  * months bubble up until they become years
            // This is because there is no context-free conversion between hours and days
            // (think of clock changes)
            // and also not between days and months (28-31 days per month)
            if (!this.isValid()) {
                return this.localeData().invalidDate();
            }

            var seconds = abs$1(this._milliseconds) / 1000,
                days = abs$1(this._days),
                months = abs$1(this._months),
                minutes,
                hours,
                years,
                s,
                total = this.asSeconds(),
                totalSign,
                ymSign,
                daysSign,
                hmsSign;

            if (!total) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            // 3600 seconds -> 60 minutes -> 1 hour
            minutes = absFloor(seconds / 60);
            hours = absFloor(minutes / 60);
            seconds %= 60;
            minutes %= 60;

            // 12 months -> 1 year
            years = absFloor(months / 12);
            months %= 12;

            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';

            totalSign = total < 0 ? '-' : '';
            ymSign = sign(this._months) !== sign(total) ? '-' : '';
            daysSign = sign(this._days) !== sign(total) ? '-' : '';
            hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

            return (
                totalSign +
                'P' +
                (years ? ymSign + years + 'Y' : '') +
                (months ? ymSign + months + 'M' : '') +
                (days ? daysSign + days + 'D' : '') +
                (hours || minutes || seconds ? 'T' : '') +
                (hours ? hmsSign + hours + 'H' : '') +
                (minutes ? hmsSign + minutes + 'M' : '') +
                (seconds ? hmsSign + s + 'S' : '')
            );
        }

        var proto$2 = Duration.prototype;

        proto$2.isValid = isValid$1;
        proto$2.abs = abs;
        proto$2.add = add$1;
        proto$2.subtract = subtract$1;
        proto$2.as = as;
        proto$2.asMilliseconds = asMilliseconds;
        proto$2.asSeconds = asSeconds;
        proto$2.asMinutes = asMinutes;
        proto$2.asHours = asHours;
        proto$2.asDays = asDays;
        proto$2.asWeeks = asWeeks;
        proto$2.asMonths = asMonths;
        proto$2.asQuarters = asQuarters;
        proto$2.asYears = asYears;
        proto$2.valueOf = valueOf$1;
        proto$2._bubble = bubble;
        proto$2.clone = clone$1;
        proto$2.get = get$2;
        proto$2.milliseconds = milliseconds;
        proto$2.seconds = seconds;
        proto$2.minutes = minutes;
        proto$2.hours = hours;
        proto$2.days = days;
        proto$2.weeks = weeks;
        proto$2.months = months;
        proto$2.years = years;
        proto$2.humanize = humanize;
        proto$2.toISOString = toISOString$1;
        proto$2.toString = toISOString$1;
        proto$2.toJSON = toISOString$1;
        proto$2.locale = locale;
        proto$2.localeData = localeData;

        proto$2.toIsoString = deprecate(
            'toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',
            toISOString$1
        );
        proto$2.lang = lang;

        // FORMATTING

        addFormatToken('X', 0, 0, 'unix');
        addFormatToken('x', 0, 0, 'valueOf');

        // PARSING

        addRegexToken('x', matchSigned);
        addRegexToken('X', matchTimestamp);
        addParseToken('X', function (input, array, config) {
            config._d = new Date(parseFloat(input) * 1000);
        });
        addParseToken('x', function (input, array, config) {
            config._d = new Date(toInt(input));
        });

        //! moment.js

        hooks.version = '2.29.1';

        setHookCallback(createLocal);

        hooks.fn = proto;
        hooks.min = min;
        hooks.max = max;
        hooks.now = now;
        hooks.utc = createUTC;
        hooks.unix = createUnix;
        hooks.months = listMonths;
        hooks.isDate = isDate;
        hooks.locale = getSetGlobalLocale;
        hooks.invalid = createInvalid;
        hooks.duration = createDuration;
        hooks.isMoment = isMoment;
        hooks.weekdays = listWeekdays;
        hooks.parseZone = createInZone;
        hooks.localeData = getLocale;
        hooks.isDuration = isDuration;
        hooks.monthsShort = listMonthsShort;
        hooks.weekdaysMin = listWeekdaysMin;
        hooks.defineLocale = defineLocale;
        hooks.updateLocale = updateLocale;
        hooks.locales = listLocales;
        hooks.weekdaysShort = listWeekdaysShort;
        hooks.normalizeUnits = normalizeUnits;
        hooks.relativeTimeRounding = getSetRelativeTimeRounding;
        hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
        hooks.calendarFormat = getCalendarFormat;
        hooks.prototype = proto;

        // currently HTML5 input type only supports 24-hour formats
        hooks.HTML5_FMT = {
            DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm', // <input type="datetime-local" />
            DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss', // <input type="datetime-local" step="1" />
            DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS', // <input type="datetime-local" step="0.001" />
            DATE: 'YYYY-MM-DD', // <input type="date" />
            TIME: 'HH:mm', // <input type="time" />
            TIME_SECONDS: 'HH:mm:ss', // <input type="time" step="1" />
            TIME_MS: 'HH:mm:ss.SSS', // <input type="time" step="0.001" />
            WEEK: 'GGGG-[W]WW', // <input type="week" />
            MONTH: 'YYYY-MM', // <input type="month" />
        };

        return hooks;

    })));
    });

    function time(input) {
        return moment(input, 'HH:mm');
    }

    const subscriber_queue$1 = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable$1(value, start) {
        return {
            subscribe: writable$1(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable$1(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal$1(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue$1.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue$1.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue$1.length; i += 2) {
                            subscriber_queue$1[i][0](subscriber_queue$1[i + 1]);
                        }
                        subscriber_queue$1.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived$1(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable$1(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop$1;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function$1(result) ? result : noop$1;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe$1(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all$1(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.23.0 */

    function create_fragment$j(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[16].default;
    	const default_slot = create_slot$1(default_slot_template, ctx, /*$$scope*/ ctx[15], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot$1(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[15], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in$1(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out$1(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $base;
    	let $location;
    	let $routes;
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext$1(LOCATION);
    	const routerContext = getContext$1(ROUTER);
    	const routes = writable$1([]);
    	validate_store$1(routes, "routes");
    	component_subscribe$1($$self, routes, value => $$invalidate(8, $routes = value));
    	const activeRoute = writable$1(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable$1(url ? { pathname: url } : globalHistory.location);

    	validate_store$1(location, "location");
    	component_subscribe$1($$self, location, value => $$invalidate(7, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable$1({ path: basepath, uri: basepath });

    	validate_store$1(base, "base");
    	component_subscribe$1($$self, base, value => $$invalidate(6, $base = value));

    	const routerBase = derived$1([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount$1(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext$1(LOCATION, location);
    	}

    	setContext$1(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ["basepath", "url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots$1("Router", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("$$scope" in $$props) $$invalidate(15, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext: getContext$1,
    		setContext: setContext$1,
    		onMount: onMount$1,
    		writable: writable$1,
    		derived: derived$1,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$base,
    		$location,
    		$routes
    	});

    	$$self.$inject_state = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 64) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			{
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 384) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		hasActiveRoute,
    		$base,
    		$location,
    		$routes,
    		locationContext,
    		routerContext,
    		activeRoute,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$$scope,
    		$$slots
    	];
    }

    class Router extends SvelteComponentDev$1 {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$j, create_fragment$j, safe_not_equal$1, { basepath: 3, url: 4 });

    		dispatch_dev$1("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.23.0 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 2,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[1],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$3, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev$1(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros$1();

    				transition_out$1(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros$1();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in$1(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in$1(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out$1(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev$1(if_block_anchor);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[13].default;
    	const default_slot = create_slot$1(default_slot_template, ctx, /*$$scope*/ ctx[12], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, routeParams, $location*/ 4114) {
    					update_slot$1(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in$1(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out$1(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1$3(ctx) {
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[1],
    		/*routeProps*/ ctx[2]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign$1(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component$1(switch_instance.$$.fragment);
    			switch_instance_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component$1(switch_instance, target, anchor);
    			}

    			insert_dev$1(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 22)
    			? get_spread_update$1(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 2 && get_spread_object$1(/*routeParams*/ ctx[1]),
    					dirty & /*routeProps*/ 4 && get_spread_object$1(/*routeProps*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros$1();
    					const old_component = switch_instance;

    					transition_out$1(old_component.$$.fragment, 1, 0, () => {
    						destroy_component$1(old_component, 1);
    					});

    					check_outros$1();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component$1(switch_instance.$$.fragment);
    					transition_in$1(switch_instance.$$.fragment, 1);
    					mount_component$1(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in$1(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out$1(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev$1(switch_instance_anchor);
    			if (switch_instance) destroy_component$1(switch_instance, detaching);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[3] !== null && /*$activeRoute*/ ctx[3].route === /*route*/ ctx[7] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev$1(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[3] !== null && /*$activeRoute*/ ctx[3].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 8) {
    						transition_in$1(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in$1(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros$1();

    				transition_out$1(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros$1();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in$1(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out$1(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev$1(if_block_anchor);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext$1(ROUTER);
    	validate_store$1(activeRoute, "activeRoute");
    	component_subscribe$1($$self, activeRoute, value => $$invalidate(3, $activeRoute = value));
    	const location = getContext$1(LOCATION);
    	validate_store$1(location, "location");
    	component_subscribe$1($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy$1(() => {
    			unregisterRoute(route);
    		});
    	}

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots$1("Route", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$invalidate(11, $$props = assign$1(assign$1({}, $$props), exclude_internal_props$1($$new_props)));
    		if ("path" in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext: getContext$1,
    		onDestroy: onDestroy$1,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(11, $$props = assign$1(assign$1({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("routeParams" in $$props) $$invalidate(1, routeParams = $$new_props.routeParams);
    		if ("routeProps" in $$props) $$invalidate(2, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 8) {
    			if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(1, routeParams = $activeRoute.params);
    			}
    		}

    		{
    			const { path, component, ...rest } = $$props;
    			$$invalidate(2, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props$1($$props);

    	return [
    		component,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		registerRoute,
    		unregisterRoute,
    		$$props,
    		$$scope,
    		$$slots
    	];
    }

    class Route extends SvelteComponentDev$1 {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$i, create_fragment$i, safe_not_equal$1, { path: 8, component: 0 });

    		dispatch_dev$1("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.23.0 */
    const file$g = "node_modules\\svelte-routing\\src\\Link.svelte";

    function create_fragment$h(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[17].default;
    	const default_slot = create_slot$1(default_slot_template, ctx, /*$$scope*/ ctx[16], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1],
    		/*$$restProps*/ ctx[6]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign$1(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element$1("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location$1(a, file$g, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev$1(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev$1(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 65536) {
    					update_slot$1(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update$1(a_levels, [
    				dirty & /*href*/ 1 && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1],
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in$1(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out$1(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev$1(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props$1($$props, omit_props_names);
    	let $base;
    	let $location;
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext$1(ROUTER);
    	validate_store$1(base, "base");
    	component_subscribe$1($$self, base, value => $$invalidate(13, $base = value));
    	const location = getContext$1(LOCATION);
    	validate_store$1(location, "location");
    	component_subscribe$1($$self, location, value => $$invalidate(14, $location = value));
    	const dispatch = createEventDispatcher$1();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots$1("Link", $$slots, ['default']);

    	$$self.$set = $$new_props => {
    		$$props = assign$1(assign$1({}, $$props), exclude_internal_props$1($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props$1($$props, omit_props_names));
    		if ("to" in $$new_props) $$invalidate(7, to = $$new_props.to);
    		if ("replace" in $$new_props) $$invalidate(8, replace = $$new_props.replace);
    		if ("state" in $$new_props) $$invalidate(9, state = $$new_props.state);
    		if ("getProps" in $$new_props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ("$$scope" in $$new_props) $$invalidate(16, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext: getContext$1,
    		createEventDispatcher: createEventDispatcher$1,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		$base,
    		$location,
    		ariaCurrent
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("to" in $$props) $$invalidate(7, to = $$new_props.to);
    		if ("replace" in $$props) $$invalidate(8, replace = $$new_props.replace);
    		if ("state" in $$props) $$invalidate(9, state = $$new_props.state);
    		if ("getProps" in $$props) $$invalidate(10, getProps = $$new_props.getProps);
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("isPartiallyCurrent" in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ("isCurrent" in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ("props" in $$props) $$invalidate(1, props = $$new_props.props);
    		if ("ariaCurrent" in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	let ariaCurrent;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 8320) {
    			$$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 16385) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 16385) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 23553) {
    			$$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		$$restProps,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$base,
    		$location,
    		dispatch,
    		$$scope,
    		$$slots
    	];
    }

    class Link extends SvelteComponentDev$1 {
    	constructor(options) {
    		super(options);

    		init$1(this, options, instance$h, create_fragment$h, safe_not_equal$1, {
    			to: 7,
    			replace: 8,
    			state: 9,
    			getProps: 10
    		});

    		dispatch_dev$1("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Nav.svelte generated by Svelte v3.23.0 */

    const { console: console_1$4 } = globals$1;
    const file$f = "src\\components\\Nav.svelte";

    function create_fragment$g(ctx) {
    	let header;
    	let div0;
    	let a;
    	let t1;
    	let div1;
    	let input0;
    	let t2;
    	let input1;
    	let t3;
    	let input2;
    	let t4;
    	let input3;
    	let t5;
    	let input4;
    	let t6;
    	let input5;
    	let t7;
    	let input6;
    	let t8;
    	let input7;
    	let t9;
    	let input8;
    	let t10;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element$1("header");
    			div0 = element$1("div");
    			a = element$1("a");
    			a.textContent = "Svelte-gantt";
    			t1 = space$1();
    			div1 = element$1("div");
    			input0 = element$1("input");
    			t2 = space$1();
    			input1 = element$1("input");
    			t3 = space$1();
    			input2 = element$1("input");
    			t4 = space$1();
    			input3 = element$1("input");
    			t5 = space$1();
    			input4 = element$1("input");
    			t6 = space$1();
    			input5 = element$1("input");
    			t7 = space$1();
    			input6 = element$1("input");
    			t8 = space$1();
    			input7 = element$1("input");
    			t9 = space$1();
    			input8 = element$1("input");
    			t10 = space$1();
    			button = element$1("button");
    			button.textContent = "|||";
    			attr_dev$1(a, "href", "https://github.com/ANovokmet/svelte-gantt");
    			attr_dev$1(a, "class", "svelte-zfal1w");
    			add_location$1(a, file$f, 140, 8, 3480);
    			attr_dev$1(div0, "class", "header-title svelte-zfal1w");
    			add_location$1(div0, file$f, 139, 4, 3444);
    			attr_dev$1(input0, "type", "button");
    			input0.value = "Tree";
    			attr_dev$1(input0, "class", "svelte-zfal1w");
    			add_location$1(input0, file$f, 143, 8, 3605);
    			attr_dev$1(input1, "type", "button");
    			input1.value = "Dependencies";
    			attr_dev$1(input1, "class", "svelte-zfal1w");
    			add_location$1(input1, file$f, 144, 8, 3700);
    			attr_dev$1(input2, "type", "button");
    			input2.value = "Large";
    			attr_dev$1(input2, "class", "svelte-zfal1w");
    			add_location$1(input2, file$f, 145, 8, 3812);
    			attr_dev$1(input3, "type", "button");
    			input3.value = "External";
    			attr_dev$1(input3, "class", "svelte-zfal1w");
    			add_location$1(input3, file$f, 146, 8, 3905);
    			attr_dev$1(input4, "type", "button");
    			input4.value = "Events";
    			attr_dev$1(input4, "class", "svelte-zfal1w");
    			add_location$1(input4, file$f, 147, 8, 4009);
    			attr_dev$1(input5, "type", "button");
    			input5.value = "<";
    			attr_dev$1(input5, "class", "svelte-zfal1w");
    			add_location$1(input5, file$f, 149, 8, 4111);
    			attr_dev$1(input6, "type", "button");
    			input6.value = "Day view";
    			attr_dev$1(input6, "class", "svelte-zfal1w");
    			add_location$1(input6, file$f, 150, 8, 4181);
    			attr_dev$1(input7, "type", "button");
    			input7.value = ">";
    			attr_dev$1(input7, "class", "svelte-zfal1w");
    			add_location$1(input7, file$f, 151, 8, 4254);
    			attr_dev$1(input8, "type", "button");
    			input8.value = "Week view";
    			attr_dev$1(input8, "class", "svelte-zfal1w");
    			add_location$1(input8, file$f, 153, 8, 4322);
    			attr_dev$1(button, "class", "svelte-zfal1w");
    			add_location$1(button, file$f, 155, 8, 4474);
    			attr_dev$1(div1, "class", "header-controls svelte-zfal1w");
    			add_location$1(div1, file$f, 142, 4, 3566);
    			attr_dev$1(header, "class", "header svelte-zfal1w");
    			add_location$1(header, file$f, 138, 0, 3415);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev$1(target, header, anchor);
    			append_dev$1(header, div0);
    			append_dev$1(div0, a);
    			append_dev$1(header, t1);
    			append_dev$1(header, div1);
    			append_dev$1(div1, input0);
    			append_dev$1(div1, t2);
    			append_dev$1(div1, input1);
    			append_dev$1(div1, t3);
    			append_dev$1(div1, input2);
    			append_dev$1(div1, t4);
    			append_dev$1(div1, input3);
    			append_dev$1(div1, t5);
    			append_dev$1(div1, input4);
    			append_dev$1(div1, t6);
    			append_dev$1(div1, input5);
    			append_dev$1(div1, t7);
    			append_dev$1(div1, input6);
    			append_dev$1(div1, t8);
    			append_dev$1(div1, input7);
    			append_dev$1(div1, t9);
    			append_dev$1(div1, input8);
    			append_dev$1(div1, t10);
    			append_dev$1(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev$1(input0, "click", /*click_handler*/ ctx[11], false, false, false),
    					listen_dev$1(input1, "click", /*click_handler_1*/ ctx[12], false, false, false),
    					listen_dev$1(input2, "click", /*click_handler_2*/ ctx[13], false, false, false),
    					listen_dev$1(input3, "click", /*click_handler_3*/ ctx[14], false, false, false),
    					listen_dev$1(input4, "click", /*click_handler_4*/ ctx[15], false, false, false),
    					listen_dev$1(input5, "click", /*onSetPreviousDay*/ ctx[3], false, false, false),
    					listen_dev$1(input6, "click", /*onSetDayView*/ ctx[0], false, false, false),
    					listen_dev$1(input7, "click", /*onSetNextDay*/ ctx[2], false, false, false),
    					listen_dev$1(input8, "click", /*onSetWeekView*/ ctx[1], false, false, false),
    					listen_dev$1(button, "click", /*onToggleOptions*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev$1(header);
    			mounted = false;
    			run_all$1(dispose);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { currentStart = time("06:00") } = $$props;
    	let { currentEnd = time("18:00") } = $$props;
    	const dispatch = createEventDispatcher$1();

    	function onUpdateOptions(options) {
    		dispatch("updateOptions", options);
    	}

    	function onSetDayView() {
    		console.log("day view set");

    		onUpdateOptions({
    			fitWidth: true,
    			columnUnit: "minute",
    			columnOffset: 15,
    			from: currentStart,
    			to: currentEnd,
    			minWidth: 1000,
    			headers: [{ unit: "day", format: "DD.MM.YYYY" }, { unit: "hour", format: "HH" }]
    		});
    	}

    	

    	function onSetWeekView() {
    		console.log("week view set");

    		onUpdateOptions({
    			fitWidth: false,
    			columnUnit: "hour",
    			columnOffset: 1,
    			from: currentStart.clone().startOf("week"),
    			to: currentStart.clone().endOf("week"),
    			minWidth: 5000,
    			headers: [
    				{
    					unit: "month",
    					format: "MMMM YYYY",
    					sticky: true
    				},
    				{
    					unit: "day",
    					format: "ddd DD",
    					sticky: true
    				}
    			]
    		});
    	}

    	

    	function onSetNextDay() {
    		currentStart.add(1, "day");
    		currentEnd.add(1, "day");
    		console.log("set next day");
    		onUpdateOptions({ from: currentStart, to: currentEnd });
    	}

    	

    	function onSetPreviousDay() {
    		currentStart.subtract(1, "day");
    		currentEnd.subtract(1, "day");
    		console.log("set previous day");
    		onUpdateOptions({ from: currentStart, to: currentEnd });
    	}

    	
    	let { toggle } = getContext$1("options");

    	function onToggleOptions() {
    		toggle.update(v => !v);
    		dispatch("toggleOptions");
    	}

    	function onLoadRoute(route) {
    		dispatch("loadRoute", { url: route });
    	}

    	const writable_props = ["currentStart", "currentEnd"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots$1("Nav", $$slots, []);
    	const click_handler = () => onLoadRoute("/svelte-gantt/tree");
    	const click_handler_1 = () => onLoadRoute("/svelte-gantt/dependencies");
    	const click_handler_2 = () => onLoadRoute("/svelte-gantt/");
    	const click_handler_3 = () => onLoadRoute("/svelte-gantt/external");
    	const click_handler_4 = () => onLoadRoute("/svelte-gantt/events");

    	$$self.$set = $$props => {
    		if ("currentStart" in $$props) $$invalidate(6, currentStart = $$props.currentStart);
    		if ("currentEnd" in $$props) $$invalidate(7, currentEnd = $$props.currentEnd);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher: createEventDispatcher$1,
    		time,
    		getContext: getContext$1,
    		currentStart,
    		currentEnd,
    		dispatch,
    		onUpdateOptions,
    		onSetDayView,
    		onSetWeekView,
    		onSetNextDay,
    		onSetPreviousDay,
    		toggle,
    		onToggleOptions,
    		onLoadRoute,
    		Router,
    		Link,
    		Route
    	});

    	$$self.$inject_state = $$props => {
    		if ("currentStart" in $$props) $$invalidate(6, currentStart = $$props.currentStart);
    		if ("currentEnd" in $$props) $$invalidate(7, currentEnd = $$props.currentEnd);
    		if ("toggle" in $$props) toggle = $$props.toggle;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		onSetDayView,
    		onSetWeekView,
    		onSetNextDay,
    		onSetPreviousDay,
    		onToggleOptions,
    		onLoadRoute,
    		currentStart,
    		currentEnd,
    		dispatch,
    		onUpdateOptions,
    		toggle,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4
    	];
    }

    class Nav extends SvelteComponentDev$1 {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$g, create_fragment$g, safe_not_equal$1, { currentStart: 6, currentEnd: 7 });

    		dispatch_dev$1("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get currentStart() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentStart(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentEnd() {
    		throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentEnd(value) {
    		throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        const z_index = (parseInt(computed_style.zIndex) || 0) - 1;
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', `display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ` +
            `overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: ${z_index};`);
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = `data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>`;
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error(`Cannot have duplicate keys in a keyed each`);
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.23.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function createEntityStore() {
        const { subscribe, set, update } = writable({ ids: [], entities: {} });
        return {
            set,
            _update: update,
            subscribe,
            add: (item) => update(({ ids, entities }) => ({
                ids: [...ids, item.model.id],
                entities: Object.assign(Object.assign({}, entities), { [item.model.id]: item })
            })),
            delete: (id) => update(state => {
                const _a = state.entities, _b = id; _a[_b]; const entities = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                return {
                    ids: state.ids.filter(i => i !== id),
                    entities
                };
            }),
            deleteAll: (ids) => update(state => {
                const entities = Object.assign({}, state.entities);
                const idState = {};
                ids.forEach(id => {
                    delete entities[id];
                    idState[id] = true;
                });
                return {
                    ids: state.ids.filter(i => !idState[i]),
                    entities
                };
            }),
            update: (item) => update(({ ids, entities }) => ({
                ids,
                entities: Object.assign(Object.assign({}, entities), { [item.model.id]: item })
            })),
            upsert: (item) => update(({ ids, entities }) => {
                const hasIndex = ids.indexOf(item.model.id) !== -1;
                return {
                    ids: hasIndex ? ids : [...ids, item.model.id],
                    entities: Object.assign(Object.assign({}, entities), { [item.model.id]: item })
                };
            }),
            upsertAll: (items) => update(state => {
                const entities = Object.assign({}, state.entities);
                const ids = [...state.ids];
                items.forEach(item => {
                    if (!entities[item.model.id]) {
                        ids.push(item.model.id);
                    }
                    entities[item.model.id] = item;
                });
                return {
                    ids,
                    entities
                };
            }),
            addAll: (items) => {
                const ids = [];
                const entities = {};
                for (const entity of items) {
                    ids.push(entity.model.id);
                    entities[entity.model.id] = entity;
                }
                set({ ids, entities });
            },
            refresh: () => update(store => (Object.assign({}, store)))
        };
    }
    const taskStore = createEntityStore();
    const rowStore = createEntityStore();
    const timeRangeStore = createEntityStore();
    const allTasks = all(taskStore);
    const allRows = all(rowStore);
    const allTimeRanges = all(timeRangeStore);
    const rowTaskCache = derived(allTasks, $allTasks => {
        return $allTasks.reduce((cache, task) => {
            if (!cache[task.model.resourceId])
                cache[task.model.resourceId] = [];
            cache[task.model.resourceId].push(task.model.id);
            return cache;
        }, {});
    });
    function all(store) {
        return derived(store, ({ ids, entities }) => ids.map(id => entities[id]));
    }

    function isLeftClick(event) {
        return event.which === 1;
    }
    /**
     * Gets mouse position within an element
     * @param node
     * @param event
     */
    function getRelativePos(node, event) {
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left; //x position within the element.
        const y = event.clientY - rect.top; //y position within the element.
        return {
            x: x,
            y: y
        };
    }
    /**
     * Adds an event listener that triggers once.
     * @param target
     * @param type
     * @param listener
     * @param addOptions
     * @param removeOptions
     */
    function addEventListenerOnce(target, type, listener, addOptions, removeOptions) {
        target.addEventListener(type, function fn(event) {
            target.removeEventListener(type, fn, removeOptions);
            listener.apply(this, arguments, addOptions);
        });
    }
    /**
     * Sets the cursor on an element. Globally by default.
     * @param cursor
     * @param node
     */
    function setCursor(cursor, node = document.body) {
        node.style.cursor = cursor;
    }
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate)
                    func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.apply(context, args);
        };
    }
    function throttle(func, limit) {
        var wait = false;
        return function () {
            if (!wait) {
                func.apply(null, arguments);
                wait = true;
                setTimeout(function () {
                    wait = false;
                }, limit);
            }
        };
    }

    const MIN_DRAG_X = 2;
    const MIN_DRAG_Y = 2;

    /**
     * Applies dragging interaction to gantt elements
     */
    class Draggable {
        constructor(node, settings) {
            this.dragging = false;
            this.resizing = false;
            this.resizeTriggered = false;
            this.onmousedown = (event) => {
                if (!isLeftClick(event)) {
                    return;
                }
                event.stopPropagation();
                event.preventDefault();
                const canDrag = this.dragAllowed;
                const canResize = this.resizeAllowed;
                if (canDrag || canResize) {
                    const x = this.settings.getX(event);
                    const y = this.settings.getY(event);
                    const width = this.settings.getWidth();
                    this.initialX = event.clientX;
                    this.initialY = event.clientY;
                    this.mouseStartPosX = getRelativePos(this.settings.container, event).x - x;
                    this.mouseStartPosY = getRelativePos(this.settings.container, event).y - y;
                    this.mouseStartRight = x + width;
                    if (canResize && this.mouseStartPosX < this.settings.resizeHandleWidth) {
                        this.direction = 'left';
                        this.resizing = true;
                    }
                    if (canResize && this.mouseStartPosX > width - this.settings.resizeHandleWidth) {
                        this.direction = 'right';
                        this.resizing = true;
                    }
                    if (canDrag && !this.resizing) {
                        this.dragging = true;
                    }
                    if ((this.dragging || this.resizing) && this.settings.onDown) {
                        this.settings.onDown({
                            mouseEvent: event,
                            x,
                            width,
                            y,
                            resizing: this.resizing,
                            dragging: this.dragging
                        });
                    }
                    window.addEventListener('mousemove', this.onmousemove, false);
                    addEventListenerOnce(window, 'mouseup', this.onmouseup);
                }
            };
            this.onmousemove = (event) => {
                if (!this.resizeTriggered) {
                    if (Math.abs(event.clientX - this.initialX) > MIN_DRAG_X || Math.abs(event.clientY - this.initialY) > MIN_DRAG_Y) {
                        this.resizeTriggered = true;
                    }
                    else {
                        return;
                    }
                }
                event.preventDefault();
                if (this.resizing) {
                    const mousePos = getRelativePos(this.settings.container, event);
                    const x = this.settings.getX(event);
                    const width = this.settings.getWidth();
                    let resultX;
                    let resultWidth;
                    if (this.direction === 'left') { //resize ulijevo
                        if (mousePos.x > x + width) {
                            this.direction = 'right';
                            resultX = this.mouseStartRight;
                            resultWidth = this.mouseStartRight - mousePos.x;
                            this.mouseStartRight = this.mouseStartRight + width;
                        }
                        else {
                            resultX = mousePos.x;
                            resultWidth = this.mouseStartRight - mousePos.x;
                        }
                    }
                    else if (this.direction === 'right') { //resize desno
                        if (mousePos.x <= x) {
                            this.direction = 'left';
                            resultX = mousePos.x;
                            resultWidth = x - mousePos.x;
                            this.mouseStartRight = x;
                        }
                        else {
                            resultX = x;
                            resultWidth = mousePos.x - x;
                        }
                    }
                    this.settings.onResize && this.settings.onResize({
                        mouseEvent: event,
                        x: resultX,
                        width: resultWidth
                    });
                }
                // mouseup
                if (this.dragging && this.settings.onDrag) {
                    const mousePos = getRelativePos(this.settings.container, event);
                    this.settings.onDrag({
                        mouseEvent: event,
                        x: mousePos.x - this.mouseStartPosX,
                        y: mousePos.y - this.mouseStartPosY
                    });
                }
            };
            this.onmouseup = (event) => {
                const x = this.settings.getX(event);
                const y = this.settings.getY(event);
                const width = this.settings.getWidth();
                this.settings.onMouseUp && this.settings.onMouseUp();
                if (this.resizeTriggered && this.settings.onDrop) {
                    this.settings.onDrop({
                        mouseEvent: event,
                        x,
                        y,
                        width,
                        dragging: this.dragging,
                        resizing: this.resizing
                    });
                }
                this.dragging = false;
                this.resizing = false;
                this.direction = null;
                this.resizeTriggered = false;
                window.removeEventListener('mousemove', this.onmousemove, false);
            };
            this.settings = settings;
            this.node = node;
            node.addEventListener('mousedown', this.onmousedown, false);
        }
        get dragAllowed() {
            if (typeof (this.settings.dragAllowed) === 'function') {
                return this.settings.dragAllowed();
            }
            else {
                return this.settings.dragAllowed;
            }
        }
        get resizeAllowed() {
            if (typeof (this.settings.resizeAllowed) === 'function') {
                return this.settings.resizeAllowed();
            }
            else {
                return this.settings.resizeAllowed;
            }
        }
        destroy() {
            this.node.removeEventListener('mousedown', this.onmousedown, false);
            this.node.removeEventListener('mousemove', this.onmousemove, false);
            this.node.removeEventListener('mouseup', this.onmouseup, false);
        }
    }

    class DragDropManager {
        constructor(rowStore) {
            this.handlerMap = {};
            this.register('row', (event) => {
                let elements = document.elementsFromPoint(event.clientX, event.clientY);
                let rowElement = elements.find((element) => !!element.getAttribute('data-row-id'));
                if (rowElement !== undefined) {
                    const rowId = parseInt(rowElement.getAttribute('data-row-id'));
                    const { entities } = get_store_value(rowStore);
                    const targetRow = entities[rowId];
                    if (targetRow.model.enableDragging) {
                        return targetRow;
                    }
                }
                return null;
            });
        }
        register(target, handler) {
            this.handlerMap[target] = handler;
        }
        getTarget(target, event) {
            //const rowCenterX = this.root.refs.mainContainer.getBoundingClientRect().left + this.root.refs.mainContainer.getBoundingClientRect().width / 2;
            var handler = this.handlerMap[target];
            if (handler) {
                return handler(event);
            }
        }
    }

    class TaskFactory {
        constructor(columnService) {
            this.columnService = columnService;
        }
        createTask(model) {
            // id of task, every task needs to have a unique one
            //task.id = task.id || undefined;
            // completion %, indicated on task
            model.amountDone = model.amountDone || 0;
            // css classes
            model.classes = model.classes || '';
            // date task starts on
            model.from = model.from || null;
            // date task ends on
            model.to = model.to || null;
            // label of task
            model.label = model.label || undefined;
            // html content of task, will override label
            model.html = model.html || undefined;
            // show button bar
            model.showButton = model.showButton || false;
            // button classes, useful for fontawesome icons
            model.buttonClasses = model.buttonClasses || '';
            // html content of button
            model.buttonHtml = model.buttonHtml || '';
            // enable dragging of task
            model.enableDragging = model.enableDragging === undefined ? true : model.enableDragging;
            const left = this.columnService.getPositionByDate(model.from) | 0;
            const right = this.columnService.getPositionByDate(model.to) | 0;
            return {
                model,
                left: left,
                width: right - left,
                height: this.getHeight(model),
                top: this.getPosY(model),
                reflections: []
            };
        }
        createTasks(tasks) {
            return tasks.map(task => this.createTask(task));
        }
        row(resourceId) {
            return this.rowEntities[resourceId];
        }
        getHeight(model) {
            return this.row(model.resourceId).height - 2 * this.rowPadding;
        }
        getPosY(model) {
            return this.row(model.resourceId).y + this.rowPadding;
        }
    }
    function reflectTask(task, row, options) {
        const reflectedId = `reflected-task-${task.model.id}-${row.model.id}`;
        const model = Object.assign(Object.assign({}, task.model), { resourceId: row.model.id, id: reflectedId, enableDragging: false });
        return Object.assign(Object.assign({}, task), { model, top: row.y + options.rowPadding, reflected: true, reflectedOnParent: false, reflectedOnChild: true, originalId: task.model.id });
    }

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z = ".sg-label-bottom.svelte-6qjqhr{position:absolute;top:calc(100% + 10px);color:#888}.debug.svelte-6qjqhr{position:absolute;top:-10px;right:0;font-size:8px;color:black}.sg-task.svelte-6qjqhr{position:absolute;white-space:nowrap;transition:background-color 0.2s, opacity 0.2s;pointer-events:all}.sg-task{background:rgb(116, 191, 255)}.sg-task-background.svelte-6qjqhr{position:absolute;height:100%;top:0}.sg-task-content.svelte-6qjqhr{position:absolute;height:100%;top:0;padding-left:14px;font-size:14px;display:flex;align-items:center;justify-content:flex-start}.sg-task.svelte-6qjqhr:not(.moving){transition:transform 0.2s, background-color 0.2s, width 0.2s}.sg-task.moving.svelte-6qjqhr{z-index:1;opacity:0.5}.sg-task.svelte-6qjqhr:hover::before{content:\"\";width:4px;height:50%;top:25%;position:absolute;cursor:ew-resize;border-style:solid;border-color:rgba(255, 255, 255, 0.5);margin-left:3px;left:0;border-width:0 1px;z-index:1}.sg-task.svelte-6qjqhr:hover::after{content:\"\";width:4px;height:50%;top:25%;position:absolute;cursor:ew-resize;border-style:solid;border-color:rgba(255, 255, 255, 0.5);margin-right:3px;right:0;border-width:0 1px;z-index:1}.sg-task.selected.svelte-6qjqhr{outline:2px solid rgba(3, 169, 244, 0.5);outline-offset:3px;z-index:1}.sg-task-reflected.svelte-6qjqhr{opacity:0.5}.sg-task-background.svelte-6qjqhr{background:rgba(0, 0, 0, 0.2)}.sg-task{color:white;background:rgb(116, 191, 255)}.sg-task:hover{background:rgb(98, 161, 216)}.sg-task.selected{background:rgb(69, 112, 150)}";
    styleInject(css_248z);

    /* src\entities\Task.svelte generated by Svelte v3.23.0 */

    const { Object: Object_1$4 } = globals;
    const file$8 = "src\\entities\\Task.svelte";

    // (286:2) {#if model.amountDone}
    function create_if_block_4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "sg-task-background svelte-6qjqhr");
    			set_style(div, "width", /*model*/ ctx[0].amountDone + "%");
    			add_location(div, file$8, 286, 2, 9016);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*model*/ 1) {
    				set_style(div, "width", /*model*/ ctx[0].amountDone + "%");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(286:2) {#if model.amountDone}",
    		ctx
    	});

    	return block;
    }

    // (294:4) {:else}
    function create_else_block(ctx) {
    	let t_value = /*model*/ ctx[0].label + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*model*/ 1 && t_value !== (t_value = /*model*/ ctx[0].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(294:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (292:26) 
    function create_if_block_3(ctx) {
    	let html_tag;
    	let raw_value = /*taskContent*/ ctx[9](/*model*/ ctx[0]) + "";

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(null);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*model*/ 1 && raw_value !== (raw_value = /*taskContent*/ ctx[9](/*model*/ ctx[0]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(292:26) ",
    		ctx
    	});

    	return block;
    }

    // (290:4) {#if model.html}
    function create_if_block_2(ctx) {
    	let html_tag;
    	let raw_value = /*model*/ ctx[0].html + "";

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(null);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*model*/ 1 && raw_value !== (raw_value = /*model*/ ctx[0].html + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(290:4) {#if model.html}",
    		ctx
    	});

    	return block;
    }

    // (296:4) {#if model.showButton}
    function create_if_block_1(ctx) {
    	let span;
    	let raw_value = /*model*/ ctx[0].buttonHtml + "";
    	let span_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", span_class_value = "sg-task-button " + /*model*/ ctx[0].buttonClasses + " svelte-6qjqhr");
    			add_location(span, file$8, 296, 6, 9394);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			span.innerHTML = raw_value;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*onclick*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*model*/ 1 && raw_value !== (raw_value = /*model*/ ctx[0].buttonHtml + "")) span.innerHTML = raw_value;
    			if (dirty[0] & /*model*/ 1 && span_class_value !== (span_class_value = "sg-task-button " + /*model*/ ctx[0].buttonClasses + " svelte-6qjqhr")) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(296:4) {#if model.showButton}",
    		ctx
    	});

    	return block;
    }

    // (303:2) {#if model.labelBottom}
    function create_if_block$2(ctx) {
    	let label;
    	let t_value = /*model*/ ctx[0].labelBottom + "";
    	let t;

    	const block = {
    		c: function create() {
    			label = element("label");
    			t = text(t_value);
    			attr_dev(label, "class", "sg-label-bottom svelte-6qjqhr");
    			add_location(label, file$8, 303, 4, 9569);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*model*/ 1 && t_value !== (t_value = /*model*/ ctx[0].labelBottom + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(303:2) {#if model.labelBottom}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div1;
    	let t0;
    	let div0;
    	let t1;
    	let t2;
    	let div1_data_task_id_value;
    	let div1_class_value;
    	let taskElement_action;
    	let mounted;
    	let dispose;
    	let if_block0 = /*model*/ ctx[0].amountDone && create_if_block_4(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*model*/ ctx[0].html) return create_if_block_2;
    		if (/*taskContent*/ ctx[9]) return create_if_block_3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);
    	let if_block2 = /*model*/ ctx[0].showButton && create_if_block_1(ctx);
    	let if_block3 = /*model*/ ctx[0].labelBottom && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(div0, "class", "sg-task-content svelte-6qjqhr");
    			add_location(div0, file$8, 288, 2, 9097);
    			attr_dev(div1, "data-task-id", div1_data_task_id_value = /*model*/ ctx[0].id);
    			attr_dev(div1, "class", div1_class_value = "sg-task " + /*model*/ ctx[0].classes + " svelte-6qjqhr");
    			set_style(div1, "width", /*_position*/ ctx[6].width + "px");
    			set_style(div1, "height", /*height*/ ctx[1] + "px");
    			set_style(div1, "transform", "translate(" + /*_position*/ ctx[6].x + "px, " + /*_position*/ ctx[6].y + "px)");
    			toggle_class(div1, "moving", /*_dragging*/ ctx[4] || /*_resizing*/ ctx[5]);
    			toggle_class(div1, "selected", /*selected*/ ctx[7]);
    			toggle_class(div1, "animating", /*animating*/ ctx[8]);
    			toggle_class(div1, "sg-task-reflected", /*reflected*/ ctx[2]);
    			add_location(div1, file$8, 275, 0, 8648);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			if_block1.m(div0, null);
    			append_dev(div0, t1);
    			if (if_block2) if_block2.m(div0, null);
    			append_dev(div1, t2);
    			if (if_block3) if_block3.m(div1, null);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(ctx[11].call(null, div1)),
    					action_destroyer(taskElement_action = /*taskElement*/ ctx[12].call(null, div1, /*model*/ ctx[0]))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*model*/ ctx[0].amountDone) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(div1, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div0, t1);
    				}
    			}

    			if (/*model*/ ctx[0].showButton) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					if_block2.m(div0, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*model*/ ctx[0].labelBottom) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block$2(ctx);
    					if_block3.c();
    					if_block3.m(div1, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (dirty[0] & /*model*/ 1 && div1_data_task_id_value !== (div1_data_task_id_value = /*model*/ ctx[0].id)) {
    				attr_dev(div1, "data-task-id", div1_data_task_id_value);
    			}

    			if (dirty[0] & /*model*/ 1 && div1_class_value !== (div1_class_value = "sg-task " + /*model*/ ctx[0].classes + " svelte-6qjqhr")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty[0] & /*_position*/ 64) {
    				set_style(div1, "width", /*_position*/ ctx[6].width + "px");
    			}

    			if (dirty[0] & /*height*/ 2) {
    				set_style(div1, "height", /*height*/ ctx[1] + "px");
    			}

    			if (dirty[0] & /*_position*/ 64) {
    				set_style(div1, "transform", "translate(" + /*_position*/ ctx[6].x + "px, " + /*_position*/ ctx[6].y + "px)");
    			}

    			if (taskElement_action && is_function(taskElement_action.update) && dirty[0] & /*model*/ 1) taskElement_action.update.call(null, /*model*/ ctx[0]);

    			if (dirty[0] & /*model, _dragging, _resizing*/ 49) {
    				toggle_class(div1, "moving", /*_dragging*/ ctx[4] || /*_resizing*/ ctx[5]);
    			}

    			if (dirty[0] & /*model, selected*/ 129) {
    				toggle_class(div1, "selected", /*selected*/ ctx[7]);
    			}

    			if (dirty[0] & /*model, animating*/ 257) {
    				toggle_class(div1, "animating", /*animating*/ ctx[8]);
    			}

    			if (dirty[0] & /*model, reflected*/ 5) {
    				toggle_class(div1, "sg-task-reflected", /*reflected*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $rowStore;
    	let $taskStore;
    	let $rowPadding;
    	let $selection;
    	validate_store(rowStore, "rowStore");
    	component_subscribe($$self, rowStore, $$value => $$invalidate(18, $rowStore = $$value));
    	validate_store(taskStore, "taskStore");
    	component_subscribe($$self, taskStore, $$value => $$invalidate(19, $taskStore = $$value));
    	let { model } = $$props;
    	let { height } = $$props;
    	let { left } = $$props;
    	let { top } = $$props;
    	let { width } = $$props;
    	let { reflected = false } = $$props;
    	let animating = true;
    	let _dragging = false;
    	let _resizing = false;
    	let _position = { x: left, y: top, width };

    	function updatePosition(x, y, width) {
    		if (!_dragging && !_resizing) {
    			$$invalidate(6, _position.x = x, _position);
    			$$invalidate(6, _position.y = y, _position); //row.y + 6;
    			$$invalidate(6, _position.width = width, _position);
    		} // should NOT animate on resize/update of columns
    	}

    	const { dimensionsChanged } = getContext("dimensions");
    	const { rowContainer } = getContext("gantt");
    	const { taskContent, resizeHandleWidth, rowPadding, onTaskButtonClick, reflectOnParentRows, reflectOnChildRows, taskElementHook } = getContext("options");
    	validate_store(rowPadding, "rowPadding");
    	component_subscribe($$self, rowPadding, value => $$invalidate(20, $rowPadding = value));
    	const { dndManager, api, utils, selectionManager, columnService } = getContext("services");

    	function drag(node) {
    		const ondrop = event => {
    			let rowChangeValid = true;

    			//row switching
    			const sourceRow = $rowStore.entities[model.resourceId];

    			if (event.dragging) {
    				const targetRow = dndManager.getTarget("row", event.mouseEvent);

    				if (targetRow) {
    					$$invalidate(0, model.resourceId = targetRow.model.id, model);
    					api.tasks.raise.switchRow(this, targetRow, sourceRow);
    				} else {
    					rowChangeValid = false;
    				}
    			}

    			$$invalidate(4, _dragging = $$invalidate(5, _resizing = false));
    			const task = $taskStore.entities[model.id];

    			if (rowChangeValid) {
    				const prevFrom = model.from;
    				const prevTo = model.to;
    				const newFrom = $$invalidate(0, model.from = utils.roundTo(columnService.getDateByPosition(event.x)), model);
    				const newTo = $$invalidate(0, model.to = utils.roundTo(columnService.getDateByPosition(event.x + event.width)), model);
    				const newLeft = columnService.getPositionByDate(newFrom) | 0;
    				const newRight = columnService.getPositionByDate(newTo) | 0;
    				const targetRow = $rowStore.entities[model.resourceId];
    				const left = newLeft;
    				const width = newRight - newLeft;
    				const top = $rowPadding + targetRow.y;
    				updatePosition(left, top, width);
    				const newTask = Object.assign(Object.assign({}, task), { left, width, top, model });
    				const changed = prevFrom != newFrom || prevTo != newTo || sourceRow && sourceRow.model.id !== targetRow.model.id;

    				if (changed) {
    					api.tasks.raise.change({ task: newTask, sourceRow, targetRow });
    				}

    				taskStore.update(newTask);

    				if (changed) {
    					api.tasks.raise.changed({ task: newTask, sourceRow, targetRow });
    				}

    				// update shadow tasks
    				if (newTask.reflections) {
    					taskStore.deleteAll(newTask.reflections);
    				}

    				const reflectedTasks = [];

    				if (reflectOnChildRows && targetRow.allChildren) {
    					if (!newTask.reflections) newTask.reflections = [];
    					const opts = { rowPadding: $rowPadding };

    					targetRow.allChildren.forEach(r => {
    						const reflectedTask = reflectTask(newTask, r, opts);
    						newTask.reflections.push(reflectedTask.model.id);
    						reflectedTasks.push(reflectedTask);
    					});
    				}

    				if (reflectOnParentRows && targetRow.allParents.length > 0) {
    					if (!newTask.reflections) newTask.reflections = [];
    					const opts = { rowPadding: $rowPadding };

    					targetRow.allParents.forEach(r => {
    						const reflectedTask = reflectTask(newTask, r, opts);
    						newTask.reflections.push(reflectedTask.model.id);
    						reflectedTasks.push(reflectedTask);
    					});
    				}

    				if (reflectedTasks.length > 0) {
    					taskStore.upsertAll(reflectedTasks);
    				}

    				if (!(targetRow.allParents.length > 0) && !targetRow.allChildren) {
    					newTask.reflections = null;
    				}
    			} else {
    				// reset position
    				($$invalidate(6, _position.x = task.left, _position), $$invalidate(6, _position.width = task.width, _position), $$invalidate(6, _position.y = task.top, _position));
    			}
    		};

    		const draggable = new Draggable(node,
    		{
    				onDown: event => {
    					if (event.dragging) {
    						setCursor("move");
    					}

    					if (event.resizing) {
    						setCursor("e-resize");
    					}
    				},
    				onMouseUp: () => {
    					setCursor("default");
    				},
    				onResize: event => {
    					($$invalidate(6, _position.x = event.x, _position), $$invalidate(6, _position.width = event.width, _position), $$invalidate(5, _resizing = true));
    				},
    				onDrag: event => {
    					($$invalidate(6, _position.x = event.x, _position), $$invalidate(6, _position.y = event.y, _position), $$invalidate(4, _dragging = true));
    				},
    				dragAllowed: () => {
    					return row.model.enableDragging && model.enableDragging;
    				},
    				resizeAllowed: () => {
    					return row.model.enableDragging && model.enableDragging;
    				},
    				onDrop: ondrop,
    				container: rowContainer,
    				resizeHandleWidth,
    				getX: () => _position.x,
    				getY: () => _position.y,
    				getWidth: () => _position.width
    			});

    		return { destroy: () => draggable.destroy() };
    	}

    	function taskElement(node, model) {
    		if (taskElementHook) {
    			return taskElementHook(node, model);
    		}
    	}

    	function onclick(event) {
    		if (onTaskButtonClick) {
    			onTaskButtonClick(model);
    		}
    	}

    	let selection = selectionManager.selection;
    	validate_store(selection, "selection");
    	component_subscribe($$self, selection, value => $$invalidate(21, $selection = value));
    	let selected = false;
    	let row;
    	const writable_props = ["model", "height", "left", "top", "width", "reflected"];

    	Object_1$4.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Task> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Task", $$slots, []);

    	$$self.$set = $$props => {
    		if ("model" in $$props) $$invalidate(0, model = $$props.model);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    		if ("left" in $$props) $$invalidate(14, left = $$props.left);
    		if ("top" in $$props) $$invalidate(15, top = $$props.top);
    		if ("width" in $$props) $$invalidate(16, width = $$props.width);
    		if ("reflected" in $$props) $$invalidate(2, reflected = $$props.reflected);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		afterUpdate,
    		getContext,
    		onMount,
    		onDestroy,
    		tick,
    		setCursor,
    		taskStore,
    		rowStore,
    		Draggable,
    		reflectTask,
    		model,
    		height,
    		left,
    		top,
    		width,
    		reflected,
    		animating,
    		_dragging,
    		_resizing,
    		_position,
    		updatePosition,
    		dimensionsChanged,
    		rowContainer,
    		taskContent,
    		resizeHandleWidth,
    		rowPadding,
    		onTaskButtonClick,
    		reflectOnParentRows,
    		reflectOnChildRows,
    		taskElementHook,
    		dndManager,
    		api,
    		utils,
    		selectionManager,
    		columnService,
    		drag,
    		taskElement,
    		onclick,
    		selection,
    		selected,
    		row,
    		$rowStore,
    		$taskStore,
    		$rowPadding,
    		$selection
    	});

    	$$self.$inject_state = $$props => {
    		if ("model" in $$props) $$invalidate(0, model = $$props.model);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    		if ("left" in $$props) $$invalidate(14, left = $$props.left);
    		if ("top" in $$props) $$invalidate(15, top = $$props.top);
    		if ("width" in $$props) $$invalidate(16, width = $$props.width);
    		if ("reflected" in $$props) $$invalidate(2, reflected = $$props.reflected);
    		if ("animating" in $$props) $$invalidate(8, animating = $$props.animating);
    		if ("_dragging" in $$props) $$invalidate(4, _dragging = $$props._dragging);
    		if ("_resizing" in $$props) $$invalidate(5, _resizing = $$props._resizing);
    		if ("_position" in $$props) $$invalidate(6, _position = $$props._position);
    		if ("selection" in $$props) $$invalidate(13, selection = $$props.selection);
    		if ("selected" in $$props) $$invalidate(7, selected = $$props.selected);
    		if ("row" in $$props) row = $$props.row;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*left, top, width*/ 114688) {
    			 updatePosition(left, top, width);
    		}

    		if ($$self.$$.dirty[0] & /*$selection, model*/ 2097153) {
    			 $$invalidate(7, selected = $selection.indexOf(model.id) !== -1);
    		}

    		if ($$self.$$.dirty[0] & /*$rowStore, model*/ 262145) {
    			 row = $rowStore.entities[model.resourceId];
    		}
    	};

    	return [
    		model,
    		height,
    		reflected,
    		onclick,
    		_dragging,
    		_resizing,
    		_position,
    		selected,
    		animating,
    		taskContent,
    		rowPadding,
    		drag,
    		taskElement,
    		selection,
    		left,
    		top,
    		width
    	];
    }

    class Task extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$8,
    			create_fragment$8,
    			safe_not_equal,
    			{
    				model: 0,
    				height: 1,
    				left: 14,
    				top: 15,
    				width: 16,
    				reflected: 2,
    				onclick: 3
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Task",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*model*/ ctx[0] === undefined && !("model" in props)) {
    			console.warn("<Task> was created without expected prop 'model'");
    		}

    		if (/*height*/ ctx[1] === undefined && !("height" in props)) {
    			console.warn("<Task> was created without expected prop 'height'");
    		}

    		if (/*left*/ ctx[14] === undefined && !("left" in props)) {
    			console.warn("<Task> was created without expected prop 'left'");
    		}

    		if (/*top*/ ctx[15] === undefined && !("top" in props)) {
    			console.warn("<Task> was created without expected prop 'top'");
    		}

    		if (/*width*/ ctx[16] === undefined && !("width" in props)) {
    			console.warn("<Task> was created without expected prop 'width'");
    		}
    	}

    	get model() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set model(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get reflected() {
    		throw new Error("<Task>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reflected(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onclick() {
    		return this.$$.ctx[3];
    	}

    	set onclick(value) {
    		throw new Error("<Task>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$1 = ".sg-row.svelte-ejtbeo{position:relative;width:100%;box-sizing:border-box}";
    styleInject(css_248z$1);

    /* src\entities\Row.svelte generated by Svelte v3.23.0 */
    const file$1$1 = "src\\entities\\Row.svelte";

    // (9:4) {#if row.model.contentHtml}
    function create_if_block$1$1(ctx) {
    	let html_tag;
    	let raw_value = /*row*/ ctx[0].model.contentHtml + "";

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(null);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*row*/ 1 && raw_value !== (raw_value = /*row*/ ctx[0].model.contentHtml + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1$1.name,
    		type: "if",
    		source: "(9:4) {#if row.model.contentHtml}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1$1(ctx) {
    	let div;
    	let div_class_value;
    	let div_data_row_id_value;
    	let if_block = /*row*/ ctx[0].model.contentHtml && create_if_block$1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", div_class_value = "sg-row " + /*row*/ ctx[0].model.classes + " svelte-ejtbeo");
    			attr_dev(div, "data-row-id", div_data_row_id_value = /*row*/ ctx[0].model.id);
    			set_style(div, "height", /*$rowHeight*/ ctx[3] + "px");
    			toggle_class(div, "sg-hover", /*$hoveredRow*/ ctx[1] == /*row*/ ctx[0].model.id);
    			toggle_class(div, "sg-selected", /*$selectedRow*/ ctx[2] == /*row*/ ctx[0].model.id);
    			add_location(div, file$1$1, 7, 0, 231);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*row*/ ctx[0].model.contentHtml) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1$1(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*row*/ 1 && div_class_value !== (div_class_value = "sg-row " + /*row*/ ctx[0].model.classes + " svelte-ejtbeo")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*row*/ 1 && div_data_row_id_value !== (div_data_row_id_value = /*row*/ ctx[0].model.id)) {
    				attr_dev(div, "data-row-id", div_data_row_id_value);
    			}

    			if (dirty & /*$rowHeight*/ 8) {
    				set_style(div, "height", /*$rowHeight*/ ctx[3] + "px");
    			}

    			if (dirty & /*row, $hoveredRow, row*/ 3) {
    				toggle_class(div, "sg-hover", /*$hoveredRow*/ ctx[1] == /*row*/ ctx[0].model.id);
    			}

    			if (dirty & /*row, $selectedRow, row*/ 5) {
    				toggle_class(div, "sg-selected", /*$selectedRow*/ ctx[2] == /*row*/ ctx[0].model.id);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1$1($$self, $$props, $$invalidate) {
    	let $hoveredRow;
    	let $selectedRow;
    	let $rowHeight;
    	
    	let { row } = $$props;
    	const { rowHeight } = getContext("options");
    	validate_store(rowHeight, "rowHeight");
    	component_subscribe($$self, rowHeight, value => $$invalidate(3, $rowHeight = value));
    	const { hoveredRow, selectedRow } = getContext("gantt");
    	validate_store(hoveredRow, "hoveredRow");
    	component_subscribe($$self, hoveredRow, value => $$invalidate(1, $hoveredRow = value));
    	validate_store(selectedRow, "selectedRow");
    	component_subscribe($$self, selectedRow, value => $$invalidate(2, $selectedRow = value));
    	const writable_props = ["row"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Row> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Row", $$slots, []);

    	$$self.$set = $$props => {
    		if ("row" in $$props) $$invalidate(0, row = $$props.row);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		row,
    		rowHeight,
    		hoveredRow,
    		selectedRow,
    		$hoveredRow,
    		$selectedRow,
    		$rowHeight
    	});

    	$$self.$inject_state = $$props => {
    		if ("row" in $$props) $$invalidate(0, row = $$props.row);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [row, $hoveredRow, $selectedRow, $rowHeight, rowHeight, hoveredRow, selectedRow];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1$1, create_fragment$1$1, safe_not_equal, { row: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$1$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*row*/ ctx[0] === undefined && !("row" in props)) {
    			console.warn("<Row> was created without expected prop 'row'");
    		}
    	}

    	get row() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$2 = ".sg-milestone.svelte-fuyhwd.svelte-fuyhwd{position:absolute;top:0;bottom:0;white-space:nowrap;height:20px;width:20px;min-width:40px;margin-left:-20px;display:flex;align-items:center;flex-direction:column;transition:background-color 0.2s, opacity 0.2s}.sg-milestone.svelte-fuyhwd .inside.svelte-fuyhwd{position:relative}.sg-milestone.svelte-fuyhwd .inside.svelte-fuyhwd:before{position:absolute;top:0;left:0;content:' ';height:28px;width:28px;transform-origin:0 0;transform:rotate(45deg);background-color:#feac31;border-color:#feac31}.sg-milestone.svelte-fuyhwd.svelte-fuyhwd:not(.moving){transition:transform 0.2s, background-color 0.2s, width 0.2s}.sg-milestone.moving.svelte-fuyhwd.svelte-fuyhwd{z-index:1}.sg-milestone.selected.svelte-fuyhwd.svelte-fuyhwd{outline:2px solid rgba(3, 169, 244, 0.5);outline-offset:3px;z-index:1}";
    styleInject(css_248z$2);

    /* src\entities\Milestone.svelte generated by Svelte v3.23.0 */

    const { Object: Object_1$1$1 } = globals;
    const file$2$1 = "src\\entities\\Milestone.svelte";

    function create_fragment$2$1(ctx) {
    	let div1;
    	let div0;
    	let div1_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "inside svelte-fuyhwd");
    			add_location(div0, file$2$1, 98, 4, 3317);
    			attr_dev(div1, "class", div1_class_value = "sg-milestone " + /*model*/ ctx[0].classes + " svelte-fuyhwd");
    			set_style(div1, "transform", "translate(" + /*x*/ ctx[5] + "px, " + /*y*/ ctx[6] + "px)");
    			set_style(div1, "height", /*height*/ ctx[1] + "px");
    			set_style(div1, "width", /*height*/ ctx[1] + "px");
    			toggle_class(div1, "selected", /*selected*/ ctx[7]);
    			toggle_class(div1, "moving", /*dragging*/ ctx[4]);
    			add_location(div1, file$2$1, 91, 0, 3047);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			/*div1_binding*/ ctx[24](div1);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(ctx[10].call(null, div1)),
    					listen_dev(div1, "click", /*select*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*model*/ 1 && div1_class_value !== (div1_class_value = "sg-milestone " + /*model*/ ctx[0].classes + " svelte-fuyhwd")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*x, y*/ 96) {
    				set_style(div1, "transform", "translate(" + /*x*/ ctx[5] + "px, " + /*y*/ ctx[6] + "px)");
    			}

    			if (dirty & /*height*/ 2) {
    				set_style(div1, "height", /*height*/ ctx[1] + "px");
    			}

    			if (dirty & /*height*/ 2) {
    				set_style(div1, "width", /*height*/ ctx[1] + "px");
    			}

    			if (dirty & /*model, selected*/ 129) {
    				toggle_class(div1, "selected", /*selected*/ ctx[7]);
    			}

    			if (dirty & /*model, dragging*/ 17) {
    				toggle_class(div1, "moving", /*dragging*/ ctx[4]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*div1_binding*/ ctx[24](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2$1($$self, $$props, $$invalidate) {
    	let $rowStore;
    	let $taskStore;
    	let $rowPadding;
    	let $selection;
    	validate_store(rowStore, "rowStore");
    	component_subscribe($$self, rowStore, $$value => $$invalidate(14, $rowStore = $$value));
    	validate_store(taskStore, "taskStore");
    	component_subscribe($$self, taskStore, $$value => $$invalidate(15, $taskStore = $$value));
    	let milestoneElement;
    	const { rowPadding } = getContext("options");
    	validate_store(rowPadding, "rowPadding");
    	component_subscribe($$self, rowPadding, value => $$invalidate(16, $rowPadding = value));
    	const { selectionManager, api, rowContainer, dndManager, columnService, utils } = getContext("services");
    	let { left } = $$props;
    	let { top } = $$props;
    	let { model } = $$props;
    	let { height = 20 } = $$props;
    	const selection = selectionManager.selection;
    	validate_store(selection, "selection");
    	component_subscribe($$self, selection, value => $$invalidate(17, $selection = value));
    	let dragging = false;
    	let x = null;
    	let y = null;

    	function drag(node) {
    		const draggable = new Draggable(node,
    		{
    				onDown: ({ x, y }) => {
    					
    				}, //this.set({x, y});
    				onDrag: pos => {
    					($$invalidate(5, x = pos.x), $$invalidate(6, y = pos.y), $$invalidate(4, dragging = true));
    				},
    				dragAllowed: () => {
    					return row.model.enableDragging && model.enableDragging;
    				},
    				resizeAllowed: false,
    				onDrop: ({ x, y, width, mouseEvent, dragging }) => {
    					let rowChangeValid = true;

    					//row switching
    					if (dragging) {
    						const sourceRow = $rowStore.entities[model.resourceId];
    						const targetRow = dndManager.getTarget("row", event);

    						if (targetRow) {
    							$$invalidate(0, model.resourceId = targetRow.model.id, model);
    							api.tasks.raise.switchRow(this, targetRow, sourceRow);
    						} else {
    							rowChangeValid = false;
    						}
    					}

    					dragging = false;
    					const task = $taskStore.entities[model.id];

    					if (rowChangeValid) {
    						const newFrom = utils.roundTo(columnService.getDateByPosition(x));
    						const newLeft = columnService.getPositionByDate(newFrom);
    						Object.assign(model, { from: newFrom });

    						taskStore.update(Object.assign(Object.assign({}, task), {
    							left: newLeft,
    							top: rowPadding + $rowStore.entities[model.resourceId].y,
    							model
    						}));
    					} else {
    						// reset position
    						taskStore.update(Object.assign({}, task));
    					}
    				},
    				container: rowContainer,
    				getX: () => x,
    				getY: () => y
    			});

    		return {
    			destroy() {
    				draggable.destroy();
    			}
    		};
    	}

    	onMount(() => {
    		$$invalidate(5, x = $$invalidate(11, left = columnService.getPositionByDate(model.from)));
    		$$invalidate(6, y = $$invalidate(12, top = row.y + $rowPadding));
    		
    		$$invalidate(1, height = row.height - 2 * $rowPadding);
    	});

    	function select(event) {
    		if (event.ctrlKey) {
    			selectionManager.toggleSelection(model.id);
    		} else {
    			selectionManager.selectSingle(model.id);
    		}

    		if (selected) {
    			api.tasks.raise.select(model);
    		}
    	}

    	let selected = false;
    	let row;
    	const writable_props = ["left", "top", "model", "height"];

    	Object_1$1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Milestone> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Milestone", $$slots, []);

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(3, milestoneElement = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("left" in $$props) $$invalidate(11, left = $$props.left);
    		if ("top" in $$props) $$invalidate(12, top = $$props.top);
    		if ("model" in $$props) $$invalidate(0, model = $$props.model);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		onMount,
    		getContext,
    		milestoneElement,
    		Draggable,
    		rowStore,
    		taskStore,
    		rowPadding,
    		selectionManager,
    		api,
    		rowContainer,
    		dndManager,
    		columnService,
    		utils,
    		left,
    		top,
    		model,
    		height,
    		selection,
    		dragging,
    		x,
    		y,
    		drag,
    		select,
    		selected,
    		row,
    		$rowStore,
    		$taskStore,
    		$rowPadding,
    		$selection
    	});

    	$$self.$inject_state = $$props => {
    		if ("milestoneElement" in $$props) $$invalidate(3, milestoneElement = $$props.milestoneElement);
    		if ("left" in $$props) $$invalidate(11, left = $$props.left);
    		if ("top" in $$props) $$invalidate(12, top = $$props.top);
    		if ("model" in $$props) $$invalidate(0, model = $$props.model);
    		if ("height" in $$props) $$invalidate(1, height = $$props.height);
    		if ("dragging" in $$props) $$invalidate(4, dragging = $$props.dragging);
    		if ("x" in $$props) $$invalidate(5, x = $$props.x);
    		if ("y" in $$props) $$invalidate(6, y = $$props.y);
    		if ("selected" in $$props) $$invalidate(7, selected = $$props.selected);
    		if ("row" in $$props) row = $$props.row;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dragging, left, top*/ 6160) {
    			 {
    				if (!dragging) {
    					($$invalidate(5, x = left), $$invalidate(6, y = top));
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*$selection, model*/ 131073) {
    			 $$invalidate(7, selected = $selection.indexOf(model.id) !== -1);
    		}

    		if ($$self.$$.dirty & /*$rowStore, model*/ 16385) {
    			 row = $rowStore.entities[model.resourceId];
    		}
    	};

    	return [
    		model,
    		height,
    		select,
    		milestoneElement,
    		dragging,
    		x,
    		y,
    		selected,
    		rowPadding,
    		selection,
    		drag,
    		left,
    		top,
    		row,
    		$rowStore,
    		$taskStore,
    		$rowPadding,
    		$selection,
    		selectionManager,
    		api,
    		rowContainer,
    		dndManager,
    		columnService,
    		utils,
    		div1_binding
    	];
    }

    class Milestone extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2$1, create_fragment$2$1, safe_not_equal, {
    			left: 11,
    			top: 12,
    			model: 0,
    			height: 1,
    			select: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Milestone",
    			options,
    			id: create_fragment$2$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*left*/ ctx[11] === undefined && !("left" in props)) {
    			console.warn("<Milestone> was created without expected prop 'left'");
    		}

    		if (/*top*/ ctx[12] === undefined && !("top" in props)) {
    			console.warn("<Milestone> was created without expected prop 'top'");
    		}

    		if (/*model*/ ctx[0] === undefined && !("model" in props)) {
    			console.warn("<Milestone> was created without expected prop 'model'");
    		}
    	}

    	get left() {
    		throw new Error("<Milestone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<Milestone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<Milestone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<Milestone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get model() {
    		throw new Error("<Milestone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set model(value) {
    		throw new Error("<Milestone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Milestone>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Milestone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get select() {
    		return this.$$.ctx[2];
    	}

    	set select(value) {
    		throw new Error("<Milestone>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$3 = ".sg-time-range.svelte-18yq9be{height:100%;position:absolute;display:flex;flex-direction:column;align-items:center;background-image:linear-gradient(-45deg, rgba(0, 0, 0, 0) 46%, #e03218 49%, #e03218 51%, rgba(0, 0, 0, 0) 55%);background-size:6px 6px !important;color:red;font-weight:400}.sg-time-range-label.svelte-18yq9be{margin-top:10px;background:#fff;white-space:nowrap;padding:4px;font-weight:400;font-size:10px}";
    styleInject(css_248z$3);

    /* src\entities\TimeRange.svelte generated by Svelte v3.23.0 */

    const file$3$1 = "src\\entities\\TimeRange.svelte";

    function create_fragment$3$1(ctx) {
    	let div1;
    	let div0;
    	let t_value = /*model*/ ctx[0].label + "";
    	let t;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = text(t_value);
    			attr_dev(div0, "class", "sg-time-range-label svelte-18yq9be");
    			add_location(div0, file$3$1, 15, 4, 387);
    			attr_dev(div1, "class", "sg-time-range svelte-18yq9be");
    			set_style(div1, "width", /*_position*/ ctx[2].width + "px");
    			set_style(div1, "left", /*_position*/ ctx[2].x + "px");
    			toggle_class(div1, "moving", /*resizing*/ ctx[1]);
    			add_location(div1, file$3$1, 14, 0, 273);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*model*/ 1 && t_value !== (t_value = /*model*/ ctx[0].label + "")) set_data_dev(t, t_value);

    			if (dirty & /*_position*/ 4) {
    				set_style(div1, "width", /*_position*/ ctx[2].width + "px");
    			}

    			if (dirty & /*_position*/ 4) {
    				set_style(div1, "left", /*_position*/ ctx[2].x + "px");
    			}

    			if (dirty & /*resizing*/ 2) {
    				toggle_class(div1, "moving", /*resizing*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3$1($$self, $$props, $$invalidate) {
    	let { model } = $$props;
    	let { left } = $$props;
    	let { width } = $$props;
    	let { resizing = false } = $$props;
    	const _position = { width, x: left };
    	
    	const writable_props = ["model", "left", "width", "resizing"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TimeRange> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TimeRange", $$slots, []);

    	$$self.$set = $$props => {
    		if ("model" in $$props) $$invalidate(0, model = $$props.model);
    		if ("left" in $$props) $$invalidate(3, left = $$props.left);
    		if ("width" in $$props) $$invalidate(4, width = $$props.width);
    		if ("resizing" in $$props) $$invalidate(1, resizing = $$props.resizing);
    	};

    	$$self.$capture_state = () => ({ model, left, width, resizing, _position });

    	$$self.$inject_state = $$props => {
    		if ("model" in $$props) $$invalidate(0, model = $$props.model);
    		if ("left" in $$props) $$invalidate(3, left = $$props.left);
    		if ("width" in $$props) $$invalidate(4, width = $$props.width);
    		if ("resizing" in $$props) $$invalidate(1, resizing = $$props.resizing);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*left, width*/ 24) {
    			 {
    				($$invalidate(2, _position.x = left, _position), $$invalidate(2, _position.width = width, _position));
    			}
    		}
    	};

    	return [model, resizing, _position, left, width];
    }

    class TimeRange extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3$1, create_fragment$3$1, safe_not_equal, { model: 0, left: 3, width: 4, resizing: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TimeRange",
    			options,
    			id: create_fragment$3$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*model*/ ctx[0] === undefined && !("model" in props)) {
    			console.warn("<TimeRange> was created without expected prop 'model'");
    		}

    		if (/*left*/ ctx[3] === undefined && !("left" in props)) {
    			console.warn("<TimeRange> was created without expected prop 'left'");
    		}

    		if (/*width*/ ctx[4] === undefined && !("width" in props)) {
    			console.warn("<TimeRange> was created without expected prop 'width'");
    		}
    	}

    	get model() {
    		throw new Error("<TimeRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set model(value) {
    		throw new Error("<TimeRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		throw new Error("<TimeRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<TimeRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<TimeRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<TimeRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resizing() {
    		throw new Error("<TimeRange>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resizing(value) {
    		throw new Error("<TimeRange>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$4 = ".sg-time-range-control.svelte-16dwney{position:absolute}.sg-time-range-handle-left.svelte-16dwney{position:absolute;left:0}.sg-time-range-handle-right.svelte-16dwney{position:absolute;right:0}.sg-time-range-handle-left.svelte-16dwney::before,.sg-time-range-handle-right.svelte-16dwney::before{position:absolute;content:'';bottom:4px;border-radius:6px 6px 6px 0;border:2px solid #b0b0b7;width:9px;height:9px;transform:translateX(-50%) rotate(-45deg);background-color:#fff;border-color:#e03218;cursor:ew-resize}";
    styleInject(css_248z$4);

    /* src\entities\TimeRangeHeader.svelte generated by Svelte v3.23.0 */

    const { Object: Object_1$2$1 } = globals;
    const file$4$1 = "src\\entities\\TimeRangeHeader.svelte";

    function create_fragment$4$1(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "sg-time-range-handle-left svelte-16dwney");
    			add_location(div0, file$4$1, 72, 4, 2335);
    			attr_dev(div1, "class", "sg-time-range-handle-right svelte-16dwney");
    			add_location(div1, file$4$1, 73, 4, 2395);
    			attr_dev(div2, "class", "sg-time-range-control svelte-16dwney");
    			set_style(div2, "width", /*_position*/ ctx[0].width + "px");
    			set_style(div2, "left", /*_position*/ ctx[0].x + "px");
    			add_location(div2, file$4$1, 71, 0, 2239);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(ctx[1].call(null, div0)),
    					action_destroyer(ctx[1].call(null, div1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*_position*/ 1) {
    				set_style(div2, "width", /*_position*/ ctx[0].width + "px");
    			}

    			if (dirty & /*_position*/ 1) {
    				set_style(div2, "left", /*_position*/ ctx[0].x + "px");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4$1($$self, $$props, $$invalidate) {
    	const { rowContainer } = getContext("gantt");
    	const { utils, columnService } = getContext("services");
    	const { resizeHandleWidth } = getContext("options");
    	const { from, to, width: ganttWidth, visibleWidth } = getContext("dimensions");
    	let { model } = $$props;
    	let { width } = $$props;
    	let { left } = $$props;
    	const _position = { width, x: left };
    	

    	function drag(node) {
    		const ondrop = event => {
    			const newFrom = utils.roundTo(columnService.getDateByPosition(event.x));
    			const newTo = utils.roundTo(columnService.getDateByPosition(event.x + event.width));
    			const newLeft = columnService.getPositionByDate(newFrom);
    			const newRight = columnService.getPositionByDate(newTo);
    			Object.assign(model, { from: newFrom, to: newTo });

    			update({
    				left: newLeft,
    				width: newRight - newLeft,
    				model,
    				resizing: false
    			});

    			window.removeEventListener("mousemove", onmousemove, false);
    		};

    		function update(state) {
    			timeRangeStore.update(state);
    			$$invalidate(0, _position.x = state.left, _position);
    			$$invalidate(0, _position.width = state.width, _position);
    		}

    		const draggable = new Draggable(node,
    		{
    				onDown: event => {
    					update({
    						left: event.x,
    						width: event.width,
    						model,
    						resizing: true
    					});
    				},
    				onResize: event => {
    					update({
    						left: event.x,
    						width: event.width,
    						model,
    						resizing: true
    					});
    				},
    				dragAllowed: false,
    				resizeAllowed: true,
    				onDrop: ondrop,
    				container: rowContainer,
    				resizeHandleWidth,
    				getX: () => _position.x,
    				getY: () => 0,
    				getWidth: () => _position.width
    			});

    		return { destroy: () => draggable.destroy() };
    	}

    	const writable_props = ["model", "width", "left"];

    	Object_1$2$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TimeRangeHeader> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TimeRangeHeader", $$slots, []);

    	$$self.$set = $$props => {
    		if ("model" in $$props) $$invalidate(2, model = $$props.model);
    		if ("width" in $$props) $$invalidate(3, width = $$props.width);
    		if ("left" in $$props) $$invalidate(4, left = $$props.left);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		getContext,
    		Draggable,
    		timeRangeStore,
    		rowContainer,
    		utils,
    		columnService,
    		resizeHandleWidth,
    		from,
    		to,
    		ganttWidth,
    		visibleWidth,
    		model,
    		width,
    		left,
    		_position,
    		drag
    	});

    	$$self.$inject_state = $$props => {
    		if ("model" in $$props) $$invalidate(2, model = $$props.model);
    		if ("width" in $$props) $$invalidate(3, width = $$props.width);
    		if ("left" in $$props) $$invalidate(4, left = $$props.left);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*left, width*/ 24) {
    			 {
    				($$invalidate(0, _position.x = left, _position), $$invalidate(0, _position.width = width, _position));
    			}
    		}
    	};

    	return [_position, drag, model, width, left];
    }

    class TimeRangeHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4$1, create_fragment$4$1, safe_not_equal, { model: 2, width: 3, left: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TimeRangeHeader",
    			options,
    			id: create_fragment$4$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*model*/ ctx[2] === undefined && !("model" in props)) {
    			console.warn("<TimeRangeHeader> was created without expected prop 'model'");
    		}

    		if (/*width*/ ctx[3] === undefined && !("width" in props)) {
    			console.warn("<TimeRangeHeader> was created without expected prop 'width'");
    		}

    		if (/*left*/ ctx[4] === undefined && !("left" in props)) {
    			console.warn("<TimeRangeHeader> was created without expected prop 'left'");
    		}
    	}

    	get model() {
    		throw new Error("<TimeRangeHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set model(value) {
    		throw new Error("<TimeRangeHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<TimeRangeHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<TimeRangeHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		throw new Error("<TimeRangeHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<TimeRangeHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$5 = ".column.svelte-17q2a4x{position:absolute;height:100%;box-sizing:border-box}.column.svelte-17q2a4x{border-right:#efefef 1px solid}";
    styleInject(css_248z$5);

    class MomentSvelteGanttDateAdapter {
        constructor(moment) {
            this.moment = moment;
        }
        format(date, format) {
            return this.moment(date).format(format);
        }
    }
    class NoopSvelteGanttDateAdapter {
        format(date, format) {
            const d = new Date(date);
            switch (format) {
                case 'H':
                    return d.getHours() + '';
                case 'HH':
                    return pad(d.getHours());
                case 'H:mm':
                    return `${d.getHours()}:${pad(d.getMinutes())}`;
                case 'hh:mm':
                    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
                case 'hh:mm:ss':
                    return `${d.getHours()}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
                case 'dd/MM/yyyy':
                    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
                case 'dd/MM/yyyy hh:mm':
                    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
                case 'dd/MM/yyyy hh:mm:ss':
                    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
                default:
                    console.warn(`Date Format "${format}" is not supported, use another date adapter.`);
                    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
            }
        }
    }
    function pad(value) {
        let result = value.toString();
        for (let i = result.length; i < 2; i++) {
            result = '0' + result;
        }
        return result;
    }
    function startOf(date, unit) {
        let unitMs = getDuration(unit);
        const value = Math.floor(date / unitMs) * unitMs;
        return value;
    }
    function getDuration(unit, offset = 1) {
        switch (unit) {
            case 'y':
            case 'year':
                return offset * 31536000000;
            case 'month':
                return offset * 30 * 24 * 60 * 60 * 1000;
            case 'd':
            case 'day':
                return offset * 24 * 60 * 60 * 1000;
            case 'h':
            case 'hour':
                return offset * 60 * 60 * 1000;
            case 'm':
            case 'minute':
                return offset * 60 * 1000;
            case 's':
            case 'second':
                return offset * 1000;
            default:
                throw new Error(`Unknown unit: ${unit}`);
        }
    }

    var css_248z$6 = ".column-header-row.svelte-1sbstdn.svelte-1sbstdn{box-sizing:border-box;white-space:nowrap;height:32px}.column-header-cell.svelte-1sbstdn.svelte-1sbstdn{display:inline-block;height:100%;box-sizing:border-box;text-overflow:clip;text-align:center;display:inline-flex;justify-content:center;align-items:center;font-size:1em;font-size:14px;font-weight:300;transition:background 0.2s;cursor:pointer;user-select:none;border-right:#efefef 1px solid;border-bottom:#efefef 1px solid}.column-header-cell.svelte-1sbstdn.svelte-1sbstdn:hover{background:#f9f9f9}.column-header-cell.sticky.svelte-1sbstdn>.column-header-cell-label.svelte-1sbstdn{position:sticky;left:1rem}";
    styleInject(css_248z$6);

    /* src\column\ColumnHeaderRow.svelte generated by Svelte v3.23.0 */

    const { console: console_1$3 } = globals;
    const file$5$1 = "src\\column\\ColumnHeaderRow.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (44:4) {#each _headers as _header}
    function create_each_block$1(ctx) {
    	let div1;
    	let div0;
    	let t0_value = (/*_header*/ ctx[14].label || "N/A") + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[13](/*_header*/ ctx[14], ...args);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div0, "class", "column-header-cell-label svelte-1sbstdn");
    			add_location(div0, file$5$1, 45, 12, 1612);
    			attr_dev(div1, "class", "column-header-cell svelte-1sbstdn");
    			set_style(div1, "width", /*_header*/ ctx[14].width + "px");
    			toggle_class(div1, "sticky", /*header*/ ctx[0].sticky);
    			add_location(div1, file$5$1, 44, 8, 1401);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*_headers*/ 2 && t0_value !== (t0_value = (/*_header*/ ctx[14].label || "N/A") + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*_headers*/ 2) {
    				set_style(div1, "width", /*_header*/ ctx[14].width + "px");
    			}

    			if (dirty & /*header*/ 1) {
    				toggle_class(div1, "sticky", /*header*/ ctx[0].sticky);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(44:4) {#each _headers as _header}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5$1(ctx) {
    	let div;
    	let each_value = /*_headers*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "column-header-row svelte-1sbstdn");
    			add_location(div, file$5$1, 42, 0, 1327);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*_headers, header, dispatch*/ 7) {
    				each_value = /*_headers*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5$1($$self, $$props, $$invalidate) {
    	let $width;
    	let $from;
    	const dispatch = createEventDispatcher();
    	
    	const { from, to, width } = getContext("dimensions");
    	validate_store(from, "from");
    	component_subscribe($$self, from, value => $$invalidate(10, $from = value));
    	validate_store(width, "width");
    	component_subscribe($$self, width, value => $$invalidate(9, $width = value));
    	const { dateAdapter } = getContext("options");
    	let { header } = $$props;
    	let { baseWidth } = $$props;
    	let { baseDuration } = $$props;
    	let { columnWidth } = $$props;
    	let { columnCount } = $$props;
    	let _headers = [];
    	const writable_props = ["header", "baseWidth", "baseDuration", "columnWidth", "columnCount"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<ColumnHeaderRow> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ColumnHeaderRow", $$slots, []);

    	const click_handler = _header => dispatch("dateSelected", {
    		from: _header.from,
    		to: _header.to,
    		unit: _header.unit
    	});

    	$$self.$set = $$props => {
    		if ("header" in $$props) $$invalidate(0, header = $$props.header);
    		if ("baseWidth" in $$props) $$invalidate(7, baseWidth = $$props.baseWidth);
    		if ("baseDuration" in $$props) $$invalidate(8, baseDuration = $$props.baseDuration);
    		if ("columnWidth" in $$props) $$invalidate(5, columnWidth = $$props.columnWidth);
    		if ("columnCount" in $$props) $$invalidate(6, columnCount = $$props.columnCount);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		getContext,
    		dispatch,
    		startOf,
    		getDuration,
    		from,
    		to,
    		width,
    		dateAdapter,
    		header,
    		baseWidth,
    		baseDuration,
    		columnWidth,
    		columnCount,
    		_headers,
    		$width,
    		$from
    	});

    	$$self.$inject_state = $$props => {
    		if ("header" in $$props) $$invalidate(0, header = $$props.header);
    		if ("baseWidth" in $$props) $$invalidate(7, baseWidth = $$props.baseWidth);
    		if ("baseDuration" in $$props) $$invalidate(8, baseDuration = $$props.baseDuration);
    		if ("columnWidth" in $$props) $$invalidate(5, columnWidth = $$props.columnWidth);
    		if ("columnCount" in $$props) $$invalidate(6, columnCount = $$props.columnCount);
    		if ("_headers" in $$props) $$invalidate(1, _headers = $$props._headers);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*header, baseDuration, baseWidth*/ 385) {
    			 {
    				$$invalidate(0, header.duration = getDuration(header.unit, header.offset), header);
    				const duration = header.duration;
    				const ratio = duration / baseDuration;
    				$$invalidate(5, columnWidth = baseWidth * ratio);
    			}
    		}

    		if ($$self.$$.dirty & /*$width, columnWidth, columnCount*/ 608) {
    			 {
    				$$invalidate(6, columnCount = Math.ceil($width / columnWidth));

    				if (!isFinite(columnCount)) {
    					console.error("columnCount is not finite");
    					$$invalidate(6, columnCount = 0);
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*$from, header, columnCount, columnWidth, $width*/ 1633) {
    			 {
    				const headers = [];
    				let headerTime = startOf($from, header.unit);

    				for (let i = 0; i < columnCount; i++) {
    					headers.push({
    						width: Math.min(columnWidth, $width),
    						label: dateAdapter.format(headerTime, header.format),
    						from: headerTime,
    						to: headerTime + header.duration,
    						unit: header.unit
    					});

    					headerTime += header.duration;
    				}

    				$$invalidate(1, _headers = headers);
    			}
    		}
    	};

    	return [
    		header,
    		_headers,
    		dispatch,
    		from,
    		width,
    		columnWidth,
    		columnCount,
    		baseWidth,
    		baseDuration,
    		$width,
    		$from,
    		to,
    		dateAdapter,
    		click_handler
    	];
    }

    class ColumnHeaderRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5$1, create_fragment$5$1, safe_not_equal, {
    			header: 0,
    			baseWidth: 7,
    			baseDuration: 8,
    			columnWidth: 5,
    			columnCount: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColumnHeaderRow",
    			options,
    			id: create_fragment$5$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*header*/ ctx[0] === undefined && !("header" in props)) {
    			console_1$3.warn("<ColumnHeaderRow> was created without expected prop 'header'");
    		}

    		if (/*baseWidth*/ ctx[7] === undefined && !("baseWidth" in props)) {
    			console_1$3.warn("<ColumnHeaderRow> was created without expected prop 'baseWidth'");
    		}

    		if (/*baseDuration*/ ctx[8] === undefined && !("baseDuration" in props)) {
    			console_1$3.warn("<ColumnHeaderRow> was created without expected prop 'baseDuration'");
    		}

    		if (/*columnWidth*/ ctx[5] === undefined && !("columnWidth" in props)) {
    			console_1$3.warn("<ColumnHeaderRow> was created without expected prop 'columnWidth'");
    		}

    		if (/*columnCount*/ ctx[6] === undefined && !("columnCount" in props)) {
    			console_1$3.warn("<ColumnHeaderRow> was created without expected prop 'columnCount'");
    		}
    	}

    	get header() {
    		throw new Error("<ColumnHeaderRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<ColumnHeaderRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseWidth() {
    		throw new Error("<ColumnHeaderRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseWidth(value) {
    		throw new Error("<ColumnHeaderRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseDuration() {
    		throw new Error("<ColumnHeaderRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseDuration(value) {
    		throw new Error("<ColumnHeaderRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columnWidth() {
    		throw new Error("<ColumnHeaderRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columnWidth(value) {
    		throw new Error("<ColumnHeaderRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columnCount() {
    		throw new Error("<ColumnHeaderRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columnCount(value) {
    		throw new Error("<ColumnHeaderRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class GanttUtils {
        constructor() {
        }
        /**
         * Returns position of date on a line if from and to represent length of width
         * @param {*} date
         */
        getPositionByDate(date) {
            return getPositionByDate(date, this.from, this.from + this.totalColumnDuration, this.totalColumnWidth);
        }
        getDateByPosition(x) {
            return getDateByPosition(x, this.from, this.from + this.totalColumnDuration, this.totalColumnWidth);
        }
        roundTo(date) {
            let value = Math.round(date / this.magnetDuration) * this.magnetDuration;
            return value;
        }
    }
    function getPositionByDate(date, from, to, width) {
        if (!date) {
            return undefined;
        }
        let durationTo = date - from;
        let durationToEnd = to - from;
        return durationTo / durationToEnd * width;
    }
    function getDateByPosition(x, from, to, width) {
        let durationTo = (x / width) * (to - from);
        let dateAtPosition = from + durationTo;
        return dateAtPosition;
    }
    // Returns the object on the left and right in an array using the given cmp function.
    // The compare function defined which property of the value to compare (e.g.: c => c.left)
    function getIndicesOnly(input, value, comparer, strict) {
        let lo = -1;
        let hi = input.length;
        while (hi - lo > 1) {
            let mid = Math.floor((lo + hi) / 2);
            if (strict ? comparer(input[mid]) < value : comparer(input[mid]) <= value) {
                lo = mid;
            }
            else {
                hi = mid;
            }
        }
        if (!strict && input[lo] !== undefined && comparer(input[lo]) === value) {
            hi = lo;
        }
        return [lo, hi];
    }
    function get(input, value, comparer, strict) {
        let res = getIndicesOnly(input, value, comparer, strict);
        return [input[res[0]], input[res[1]]];
    }

    /* src\column\ColumnHeader.svelte generated by Svelte v3.23.0 */

    const { console: console_1$1$1 } = globals;

    function get_each_context$1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    // (37:0) {#each headers as header}
    function create_each_block$1$1(ctx) {
    	let current;

    	const columnheaderrow = new ColumnHeaderRow({
    			props: {
    				header: /*header*/ ctx[13],
    				baseWidth: /*baseHeaderWidth*/ ctx[1],
    				baseDuration: /*baseHeaderDuration*/ ctx[2]
    			},
    			$$inline: true
    		});

    	columnheaderrow.$on("dateSelected", /*dateSelected_handler*/ ctx[12]);

    	const block = {
    		c: function create() {
    			create_component(columnheaderrow.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(columnheaderrow, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const columnheaderrow_changes = {};
    			if (dirty & /*headers*/ 1) columnheaderrow_changes.header = /*header*/ ctx[13];
    			if (dirty & /*baseHeaderWidth*/ 2) columnheaderrow_changes.baseWidth = /*baseHeaderWidth*/ ctx[1];
    			if (dirty & /*baseHeaderDuration*/ 4) columnheaderrow_changes.baseDuration = /*baseHeaderDuration*/ ctx[2];
    			columnheaderrow.$set(columnheaderrow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(columnheaderrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(columnheaderrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(columnheaderrow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1$1.name,
    		type: "each",
    		source: "(37:0) {#each headers as header}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*headers*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1$1(get_each_context$1$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*headers, baseHeaderWidth, baseHeaderDuration*/ 7) {
    				each_value = /*headers*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6$1($$self, $$props, $$invalidate) {
    	let $from;
    	let $to;
    	let $width;
    	let { headers } = $$props;
    	let { columnUnit } = $$props;
    	let { columnOffset } = $$props;
    	const { from, to, width } = getContext("dimensions");
    	validate_store(from, "from");
    	component_subscribe($$self, from, value => $$invalidate(9, $from = value));
    	validate_store(to, "to");
    	component_subscribe($$self, to, value => $$invalidate(10, $to = value));
    	validate_store(width, "width");
    	component_subscribe($$self, width, value => $$invalidate(11, $width = value));
    	let minHeader;
    	let baseHeaderWidth;
    	let baseHeaderDuration;
    	const writable_props = ["headers", "columnUnit", "columnOffset"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1$1.warn(`<ColumnHeader> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ColumnHeader", $$slots, []);

    	function dateSelected_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("headers" in $$props) $$invalidate(0, headers = $$props.headers);
    		if ("columnUnit" in $$props) $$invalidate(6, columnUnit = $$props.columnUnit);
    		if ("columnOffset" in $$props) $$invalidate(7, columnOffset = $$props.columnOffset);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		getPositionByDate,
    		getDuration,
    		ColumnHeaderRow,
    		headers,
    		columnUnit,
    		columnOffset,
    		from,
    		to,
    		width,
    		minHeader,
    		baseHeaderWidth,
    		baseHeaderDuration,
    		$from,
    		$to,
    		$width
    	});

    	$$self.$inject_state = $$props => {
    		if ("headers" in $$props) $$invalidate(0, headers = $$props.headers);
    		if ("columnUnit" in $$props) $$invalidate(6, columnUnit = $$props.columnUnit);
    		if ("columnOffset" in $$props) $$invalidate(7, columnOffset = $$props.columnOffset);
    		if ("minHeader" in $$props) $$invalidate(8, minHeader = $$props.minHeader);
    		if ("baseHeaderWidth" in $$props) $$invalidate(1, baseHeaderWidth = $$props.baseHeaderWidth);
    		if ("baseHeaderDuration" in $$props) $$invalidate(2, baseHeaderDuration = $$props.baseHeaderDuration);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*headers, columnUnit, columnOffset*/ 193) {
    			 {
    				let result = null;
    				let minDuration = null;

    				[...headers, { unit: columnUnit, offset: columnOffset }].forEach(header => {
    					const duration = header.duration = header.duration || getDuration(header.unit, header.offset);

    					if (duration < minDuration || minDuration === null) {
    						minDuration = duration;
    						result = header;
    					}
    				});

    				$$invalidate(8, minHeader = result);
    			}
    		}

    		if ($$self.$$.dirty & /*$from, minHeader, $to, $width, baseHeaderWidth*/ 3842) {
    			 {
    				$$invalidate(1, baseHeaderWidth = getPositionByDate($from + minHeader.duration, $from, $to, $width) | 0);
    				if (baseHeaderWidth <= 0) console.error("baseHeaderWidth is invalid, columns or headers might be too short for the current view.");
    			}
    		}

    		if ($$self.$$.dirty & /*minHeader*/ 256) {
    			 {
    				$$invalidate(2, baseHeaderDuration = minHeader.duration);
    			}
    		}
    	};

    	return [
    		headers,
    		baseHeaderWidth,
    		baseHeaderDuration,
    		from,
    		to,
    		width,
    		columnUnit,
    		columnOffset,
    		minHeader,
    		$from,
    		$to,
    		$width,
    		dateSelected_handler
    	];
    }

    class ColumnHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6$1, create_fragment$6$1, safe_not_equal, {
    			headers: 0,
    			columnUnit: 6,
    			columnOffset: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ColumnHeader",
    			options,
    			id: create_fragment$6$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*headers*/ ctx[0] === undefined && !("headers" in props)) {
    			console_1$1$1.warn("<ColumnHeader> was created without expected prop 'headers'");
    		}

    		if (/*columnUnit*/ ctx[6] === undefined && !("columnUnit" in props)) {
    			console_1$1$1.warn("<ColumnHeader> was created without expected prop 'columnUnit'");
    		}

    		if (/*columnOffset*/ ctx[7] === undefined && !("columnOffset" in props)) {
    			console_1$1$1.warn("<ColumnHeader> was created without expected prop 'columnOffset'");
    		}
    	}

    	get headers() {
    		throw new Error("<ColumnHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headers(value) {
    		throw new Error("<ColumnHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columnUnit() {
    		throw new Error("<ColumnHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columnUnit(value) {
    		throw new Error("<ColumnHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columnOffset() {
    		throw new Error("<ColumnHeader>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columnOffset(value) {
    		throw new Error("<ColumnHeader>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$7 = ".sg-columns.svelte-1clwlpk{position:absolute;height:100%;width:100%;overflow:hidden;background-repeat:repeat;background-position-x:-1px}";
    styleInject(css_248z$7);

    /* src\column\Columns.svelte generated by Svelte v3.23.0 */

    const file$6$1 = "src\\column\\Columns.svelte";

    function create_fragment$7$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "sg-columns svelte-1clwlpk");
    			set_style(div, "background-image", /*backgroundImage*/ ctx[0]);
    			add_location(div, file$6$1, 37, 0, 1114);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*backgroundImage*/ 1) {
    				set_style(div, "background-image", /*backgroundImage*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function lineAt(ctx, x) {
    	ctx.beginPath();
    	ctx.moveTo(x, 0);
    	ctx.lineTo(x, 20);
    	ctx.stroke();
    }

    function instance$7$1($$self, $$props, $$invalidate) {
    	let { columns = [] } = $$props;
    	let { columnStrokeWidth = 1 } = $$props;
    	let { columnStrokeColor = "#efefef" } = $$props;

    	function createBackground(columns) {
    		const canvas = document.createElement("canvas");
    		canvas.width = (columns.length - 1) * columns[0].width;
    		canvas.height = 20;
    		const ctx = canvas.getContext("2d");
    		ctx.shadowColor = "rgba(128,128,128,0.5)";
    		ctx.shadowOffsetX = 0;
    		ctx.shadowOffsetY = 0;
    		ctx.shadowBlur = 0.5;
    		ctx.lineWidth = columnStrokeWidth;
    		ctx.lineCap = "square";
    		ctx.strokeStyle = columnStrokeColor;
    		ctx.translate(0.5, 0.5);

    		columns.forEach(column => {
    			lineAt(ctx, column.left);
    		});

    		const dataURL = canvas.toDataURL();
    		return `url("${dataURL}")`;
    	}

    	let backgroundImage;
    	const writable_props = ["columns", "columnStrokeWidth", "columnStrokeColor"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Columns> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Columns", $$slots, []);

    	$$self.$set = $$props => {
    		if ("columns" in $$props) $$invalidate(1, columns = $$props.columns);
    		if ("columnStrokeWidth" in $$props) $$invalidate(2, columnStrokeWidth = $$props.columnStrokeWidth);
    		if ("columnStrokeColor" in $$props) $$invalidate(3, columnStrokeColor = $$props.columnStrokeColor);
    	};

    	$$self.$capture_state = () => ({
    		columns,
    		columnStrokeWidth,
    		columnStrokeColor,
    		lineAt,
    		createBackground,
    		backgroundImage
    	});

    	$$self.$inject_state = $$props => {
    		if ("columns" in $$props) $$invalidate(1, columns = $$props.columns);
    		if ("columnStrokeWidth" in $$props) $$invalidate(2, columnStrokeWidth = $$props.columnStrokeWidth);
    		if ("columnStrokeColor" in $$props) $$invalidate(3, columnStrokeColor = $$props.columnStrokeColor);
    		if ("backgroundImage" in $$props) $$invalidate(0, backgroundImage = $$props.backgroundImage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*columns*/ 2) {
    			 {
    				$$invalidate(0, backgroundImage = createBackground(columns.slice(0, 5)));
    			}
    		}
    	};

    	return [backgroundImage, columns, columnStrokeWidth, columnStrokeColor];
    }

    class Columns extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7$1, create_fragment$7$1, safe_not_equal, {
    			columns: 1,
    			columnStrokeWidth: 2,
    			columnStrokeColor: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Columns",
    			options,
    			id: create_fragment$7$1.name
    		});
    	}

    	get columns() {
    		throw new Error("<Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columns(value) {
    		throw new Error("<Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columnStrokeWidth() {
    		throw new Error("<Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columnStrokeWidth(value) {
    		throw new Error("<Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columnStrokeColor() {
    		throw new Error("<Columns>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columnStrokeColor(value) {
    		throw new Error("<Columns>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$8 = ".sg-context-menu.svelte-1noieoz{position:absolute;background:white;border:1px solid #ccc;padding:0.25em 0;font-size:10px;transition:opacity 0.4s ease 0s;opacity:1;box-shadow:rgba(0, 0, 0, 0.32) 1px 1px 3px 0px}.context-option.svelte-1noieoz:hover{background:#eee}.context-option.svelte-1noieoz{cursor:default;padding:0.2em 1em}";
    styleInject(css_248z$8);

    var css_248z$9 = ".sg-resize.svelte-1cpm1hk{z-index:2;background:#e9eaeb;width:5px;cursor:col-resize;position:absolute;height:100%;transition:width 0.2s, transform 0.2s}.sg-resize.svelte-1cpm1hk:hover{transform:translateX(-2px);width:10px}";
    styleInject(css_248z$9);

    /* src\ui\Resizer.svelte generated by Svelte v3.23.0 */
    const file$7$1 = "src\\ui\\Resizer.svelte";

    function create_fragment$8$1(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "sg-resize svelte-1cpm1hk");
    			set_style(div, "left", /*x*/ ctx[0] + "px");
    			add_location(div, file$7$1, 38, 0, 991);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(ctx[1].call(null, div));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*x*/ 1) {
    				set_style(div, "left", /*x*/ ctx[0] + "px");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8$1($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { x = 240 } = $$props;
    	let { container } = $$props;
    	let dragging = false;

    	const dragOptions = {
    		onDrag: event => {
    			($$invalidate(0, x = event.x), dragging = true);
    			dispatch("resize", { left: x });
    			setCursor("col-resize");
    		},
    		onDrop: event => {
    			($$invalidate(0, x = event.x), dragging = false);
    			dispatch("resize", { left: x });
    			setCursor("default");
    		},
    		dragAllowed: true,
    		resizeAllowed: false,
    		container,
    		getX: () => x,
    		getY: () => 0,
    		getWidth: () => 0
    	};

    	function resizer(node) {
    		return new Draggable(node, dragOptions);
    	}

    	const writable_props = ["x", "container"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Resizer> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Resizer", $$slots, []);

    	$$self.$set = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("container" in $$props) $$invalidate(2, container = $$props.container);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		dispatch,
    		Draggable,
    		setCursor,
    		x,
    		container,
    		dragging,
    		dragOptions,
    		resizer
    	});

    	$$self.$inject_state = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("container" in $$props) $$invalidate(2, container = $$props.container);
    		if ("dragging" in $$props) dragging = $$props.dragging;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*container*/ 4) {
    			 dragOptions.container = container;
    		}
    	};

    	return [x, resizer, container];
    }

    class Resizer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8$1, create_fragment$8$1, safe_not_equal, { x: 0, container: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Resizer",
    			options,
    			id: create_fragment$8$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*container*/ ctx[2] === undefined && !("container" in props)) {
    			console.warn("<Resizer> was created without expected prop 'container'");
    		}
    	}

    	get x() {
    		throw new Error("<Resizer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Resizer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get container() {
    		throw new Error("<Resizer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<Resizer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class SelectionManager {
        constructor() {
            this.selection = writable([]);
        }
        selectSingle(item) {
            this.selection.set([item]);
        }
        toggleSelection(item) {
            this.selection.update(items => {
                const index = items.indexOf(item);
                if (index !== -1) {
                    items.splice(index, 1);
                }
                else {
                    items.push(item);
                }
                return items;
            });
        }
        clearSelection() {
            this.selection.set([]);
        }
    }

    class GanttApi {
        constructor() {
            this.listeners = [];
            this.listenersMap = {};
        }
        registerEvent(featureName, eventName) {
            if (!this[featureName]) {
                this[featureName] = {};
            }
            const feature = this[featureName];
            if (!feature.on) {
                feature.on = {};
                feature.raise = {};
            }
            let eventId = 'on:' + featureName + ':' + eventName;
            feature.raise[eventName] = (...params) => {
                //todo add svelte? event listeners, looping isnt effective unless rarely used
                this.listeners.forEach(listener => {
                    if (listener.eventId === eventId) {
                        listener.handler(params);
                    }
                });
            };
            // Creating on event method featureName.oneventName
            feature.on[eventName] = (handler) => {
                // track our listener so we can turn off and on
                let listener = {
                    handler: handler,
                    eventId: eventId
                };
                this.listenersMap[eventId] = listener;
                this.listeners.push(listener);
                const removeListener = () => {
                    const index = this.listeners.indexOf(listener);
                    this.listeners.splice(index, 1);
                };
                return removeListener;
            };
        }
    }

    class RowFactory {
        constructor() {
        }
        createRow(row, y) {
            // defaults
            // id of task, every task needs to have a unique one
            //row.id = row.id || undefined;
            // css classes
            row.classes = row.classes || '';
            // html content of row
            row.contentHtml = row.contentHtml || undefined;
            // enable dragging of tasks to and from this row 
            row.enableDragging = row.enableDragging === undefined ? true : row.enableDragging;
            // height of row element
            const height = row.height || this.rowHeight;
            return {
                model: row,
                y,
                height,
                expanded: true
            };
        }
        createRows(rows) {
            const ctx = { y: 0, result: [] };
            this.createChildRows(rows, ctx);
            return ctx.result;
        }
        createChildRows(rowModels, ctx, parent = null, level = 0, parents = []) {
            const rowsAtLevel = [];
            const allRows = [];
            if (parent) {
                parents = [...parents, parent];
            }
            rowModels.forEach(rowModel => {
                const row = this.createRow(rowModel, ctx.y);
                ctx.result.push(row);
                rowsAtLevel.push(row);
                allRows.push(row);
                row.childLevel = level;
                row.parent = parent;
                row.allParents = parents;
                ctx.y += row.height;
                if (rowModel.children) {
                    const nextLevel = this.createChildRows(rowModel.children, ctx, row, level + 1, parents);
                    row.children = nextLevel.rows;
                    row.allChildren = nextLevel.allRows;
                    allRows.push(...nextLevel.allRows);
                }
            });
            return {
                rows: rowsAtLevel,
                allRows
            };
        }
    }

    class TimeRangeFactory {
        constructor(columnService) {
            this.columnService = columnService;
        }
        create(model) {
            // enable dragging
            model.enableResizing = model.enableResizing === undefined ? true : model.enableResizing;
            const left = this.columnService.getPositionByDate(model.from);
            const right = this.columnService.getPositionByDate(model.to);
            return {
                model,
                left: left,
                width: right - left,
                resizing: false
            };
        }
    }

    function findByPosition(columns, x) {
        const result = get(columns, x, c => c.left);
        return result;
    }
    function findByDate(columns, x) {
        const result = get(columns, x, c => c.from);
        return result;
    }

    const callbacks = {};
    function onDelegatedEvent(type, attr, callback) {
        if (!callbacks[type])
            callbacks[type] = {};
        callbacks[type][attr] = callback;
    }
    function offDelegatedEvent(type, attr) {
        delete callbacks[type][attr];
    }
    function matches(cbs, element) {
        let data;
        for (let attr in cbs) {
            if (data = element.getAttribute(attr)) {
                return { attr, data };
            }
        }
    }
    function onEvent(e) {
        let { type, target } = e;
        const cbs = callbacks[type];
        if (!cbs)
            return;
        let match;
        let element = target;
        while (element && element != e.currentTarget) {
            if ((match = matches(cbs, element))) {
                break;
            }
            element = element.parentElement;
        }
        if (match && cbs[match.attr]) {
            cbs[match.attr](e, match.data, element);
        }
    }

    var css_248z$a = ".sg-disable-transition.svelte-12fxs8g .sg-task,.sg-disable-transition.svelte-12fxs8g .sg-milestone{transition:transform 0s, background-color 0.2s, width 0s !important}.sg-view:not(:first-child){margin-left:5px}.right-scrollbar-visible.svelte-12fxs8g{padding-right:17px}.sg-timeline.svelte-12fxs8g{flex:1 1 0%;display:flex;flex-direction:column;overflow-x:auto}.sg-gantt.svelte-12fxs8g{display:flex;width:100%;height:100%;position:relative}.sg-foreground.svelte-12fxs8g{box-sizing:border-box;overflow:hidden;top:0;left:0;position:absolute;width:100%;height:100%;z-index:1;pointer-events:none}.sg-rows.svelte-12fxs8g{width:100%;box-sizing:border-box;overflow:hidden}.sg-timeline-body.svelte-12fxs8g{overflow:auto;flex:1 1 auto}.sg-header.svelte-12fxs8g{}.header-container.svelte-12fxs8g{}.sg-header-scroller.svelte-12fxs8g{border-right:1px solid #efefef;overflow:hidden;position:relative}.content.svelte-12fxs8g{position:relative}*{box-sizing:border-box}";
    styleInject(css_248z$a);

    /* src\Gantt.svelte generated by Svelte v3.23.0 */

    const { Error: Error_1, console: console_1$2$1 } = globals;
    const file$8$1 = "src\\Gantt.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[129] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[132] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[135] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[138] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[135] = list[i];
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[129] = list[i];
    	return child_ctx;
    }

    // (567:4) {#each ganttTableModules as module}
    function create_each_block_5(ctx) {
    	let t;
    	let current;

    	const switch_instance_spread_levels = [
    		{
    			rowContainerHeight: /*rowContainerHeight*/ ctx[16]
    		},
    		{ paddingTop: /*paddingTop*/ ctx[17] },
    		{ paddingBottom: /*paddingBottom*/ ctx[18] },
    		{ tableWidth: /*tableWidth*/ ctx[1] },
    		/*$$restProps*/ ctx[46],
    		{ visibleRows: /*visibleRows*/ ctx[19] }
    	];

    	var switch_value = /*module*/ ctx[129];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    		switch_instance.$on("init", onModuleInit);
    	}

    	const resizer = new Resizer({
    			props: {
    				x: /*tableWidth*/ ctx[1],
    				container: /*ganttElement*/ ctx[9]
    			},
    			$$inline: true
    		});

    	resizer.$on("resize", /*onResize*/ ctx[43]);

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			create_component(resizer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			mount_component(resizer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[0] & /*rowContainerHeight, paddingTop, paddingBottom, tableWidth, visibleRows*/ 983042 | dirty[1] & /*$$restProps*/ 32768)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[0] & /*rowContainerHeight*/ 65536 && {
    						rowContainerHeight: /*rowContainerHeight*/ ctx[16]
    					},
    					dirty[0] & /*paddingTop*/ 131072 && { paddingTop: /*paddingTop*/ ctx[17] },
    					dirty[0] & /*paddingBottom*/ 262144 && { paddingBottom: /*paddingBottom*/ ctx[18] },
    					dirty[0] & /*tableWidth*/ 2 && { tableWidth: /*tableWidth*/ ctx[1] },
    					dirty[1] & /*$$restProps*/ 32768 && get_spread_object(/*$$restProps*/ ctx[46]),
    					dirty[0] & /*visibleRows*/ 524288 && { visibleRows: /*visibleRows*/ ctx[19] }
    				])
    			: {};

    			if (switch_value !== (switch_value = /*module*/ ctx[129])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("init", onModuleInit);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, t.parentNode, t);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}

    			const resizer_changes = {};
    			if (dirty[0] & /*tableWidth*/ 2) resizer_changes.x = /*tableWidth*/ ctx[1];
    			if (dirty[0] & /*ganttElement*/ 512) resizer_changes.container = /*ganttElement*/ ctx[9];
    			resizer.$set(resizer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			transition_in(resizer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			transition_out(resizer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (switch_instance) destroy_component(switch_instance, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(resizer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(567:4) {#each ganttTableModules as module}",
    		ctx
    	});

    	return block;
    }

    // (578:20) {#each $allTimeRanges as timeRange (timeRange.model.id)}
    function create_each_block_4(key_1, ctx) {
    	let first;
    	let current;
    	const timerangeheader_spread_levels = [/*timeRange*/ ctx[135]];
    	let timerangeheader_props = {};

    	for (let i = 0; i < timerangeheader_spread_levels.length; i += 1) {
    		timerangeheader_props = assign(timerangeheader_props, timerangeheader_spread_levels[i]);
    	}

    	const timerangeheader = new TimeRangeHeader({
    			props: timerangeheader_props,
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(timerangeheader.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(timerangeheader, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const timerangeheader_changes = (dirty[0] & /*$allTimeRanges*/ 33554432)
    			? get_spread_update(timerangeheader_spread_levels, [get_spread_object(/*timeRange*/ ctx[135])])
    			: {};

    			timerangeheader.$set(timerangeheader_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(timerangeheader.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(timerangeheader.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(timerangeheader, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(578:20) {#each $allTimeRanges as timeRange (timeRange.model.id)}",
    		ctx
    	});

    	return block;
    }

    // (591:24) {#each visibleRows as row (row.model.id)}
    function create_each_block_3(key_1, ctx) {
    	let first;
    	let current;

    	const row = new Row({
    			props: { row: /*row*/ ctx[138] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(row.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};
    			if (dirty[0] & /*visibleRows*/ 524288) row_changes.row = /*row*/ ctx[138];
    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(591:24) {#each visibleRows as row (row.model.id)}",
    		ctx
    	});

    	return block;
    }

    // (597:20) {#each $allTimeRanges as timeRange (timeRange.model.id)}
    function create_each_block_2(key_1, ctx) {
    	let first;
    	let current;
    	const timerange_spread_levels = [/*timeRange*/ ctx[135]];
    	let timerange_props = {};

    	for (let i = 0; i < timerange_spread_levels.length; i += 1) {
    		timerange_props = assign(timerange_props, timerange_spread_levels[i]);
    	}

    	const timerange = new TimeRange({ props: timerange_props, $$inline: true });

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(timerange.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(timerange, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const timerange_changes = (dirty[0] & /*$allTimeRanges*/ 33554432)
    			? get_spread_update(timerange_spread_levels, [get_spread_object(/*timeRange*/ ctx[135])])
    			: {};

    			timerange.$set(timerange_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(timerange.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(timerange.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(timerange, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(597:20) {#each $allTimeRanges as timeRange (timeRange.model.id)}",
    		ctx
    	});

    	return block;
    }

    // (601:20) {#each visibleTasks as task (task.model.id)}
    function create_each_block_1$1(key_1, ctx) {
    	let first;
    	let current;

    	const task_spread_levels = [
    		{ model: /*task*/ ctx[132].model },
    		{ left: /*task*/ ctx[132].left },
    		{ width: /*task*/ ctx[132].width },
    		{ height: /*task*/ ctx[132].height },
    		{ top: /*task*/ ctx[132].top },
    		/*task*/ ctx[132]
    	];

    	let task_props = {};

    	for (let i = 0; i < task_spread_levels.length; i += 1) {
    		task_props = assign(task_props, task_spread_levels[i]);
    	}

    	const task = new Task({ props: task_props, $$inline: true });

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(task.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(task, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const task_changes = (dirty[0] & /*visibleTasks*/ 1048576)
    			? get_spread_update(task_spread_levels, [
    					{ model: /*task*/ ctx[132].model },
    					{ left: /*task*/ ctx[132].left },
    					{ width: /*task*/ ctx[132].width },
    					{ height: /*task*/ ctx[132].height },
    					{ top: /*task*/ ctx[132].top },
    					get_spread_object(/*task*/ ctx[132])
    				])
    			: {};

    			task.$set(task_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(task.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(task.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(task, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(601:20) {#each visibleTasks as task (task.model.id)}",
    		ctx
    	});

    	return block;
    }

    // (606:16) {#each ganttBodyModules as module}
    function create_each_block$2(ctx) {
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ paddingTop: /*paddingTop*/ ctx[17] },
    		{ paddingBottom: /*paddingBottom*/ ctx[18] },
    		{ visibleRows: /*visibleRows*/ ctx[19] },
    		/*$$restProps*/ ctx[46]
    	];

    	var switch_value = /*module*/ ctx[129];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    		switch_instance.$on("init", onModuleInit);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[0] & /*paddingTop, paddingBottom, visibleRows*/ 917504 | dirty[1] & /*$$restProps*/ 32768)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[0] & /*paddingTop*/ 131072 && { paddingTop: /*paddingTop*/ ctx[17] },
    					dirty[0] & /*paddingBottom*/ 262144 && { paddingBottom: /*paddingBottom*/ ctx[18] },
    					dirty[0] & /*visibleRows*/ 524288 && { visibleRows: /*visibleRows*/ ctx[19] },
    					dirty[1] & /*$$restProps*/ 32768 && get_spread_object(/*$$restProps*/ ctx[46])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*module*/ ctx[129])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("init", onModuleInit);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(606:16) {#each ganttBodyModules as module}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div9;
    	let t0;
    	let div8;
    	let div2;
    	let div1;
    	let div0;
    	let t1;
    	let each_blocks_4 = [];
    	let each1_lookup = new Map();
    	let div2_resize_listener;
    	let t2;
    	let div7;
    	let div6;
    	let t3;
    	let div4;
    	let div3;
    	let each_blocks_3 = [];
    	let each2_lookup = new Map();
    	let t4;
    	let div5;
    	let each_blocks_2 = [];
    	let each3_lookup = new Map();
    	let t5;
    	let each_blocks_1 = [];
    	let each4_lookup = new Map();
    	let t6;
    	let div7_resize_listener;
    	let div9_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_5 = /*ganttTableModules*/ ctx[5];
    	validate_each_argument(each_value_5);
    	let each_blocks_5 = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks_5[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const out = i => transition_out(each_blocks_5[i], 1, 1, () => {
    		each_blocks_5[i] = null;
    	});

    	const columnheader = new ColumnHeader({
    			props: {
    				headers: /*headers*/ ctx[0],
    				columnUnit: /*columnUnit*/ ctx[2],
    				columnOffset: /*columnOffset*/ ctx[3]
    			},
    			$$inline: true
    		});

    	columnheader.$on("dateSelected", /*onDateSelected*/ ctx[45]);
    	let each_value_4 = /*$allTimeRanges*/ ctx[25];
    	validate_each_argument(each_value_4);
    	const get_key = ctx => /*timeRange*/ ctx[135].model.id;
    	validate_each_keys(ctx, each_value_4, get_each_context_4, get_key);

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		let child_ctx = get_each_context_4(ctx, each_value_4, i);
    		let key = get_key(child_ctx);
    		each1_lookup.set(key, each_blocks_4[i] = create_each_block_4(key, child_ctx));
    	}

    	const columns_1 = new Columns({
    			props: {
    				columns: /*columns*/ ctx[13],
    				columnStrokeColor: /*columnStrokeColor*/ ctx[7],
    				columnStrokeWidth: /*columnStrokeWidth*/ ctx[8]
    			},
    			$$inline: true
    		});

    	let each_value_3 = /*visibleRows*/ ctx[19];
    	validate_each_argument(each_value_3);
    	const get_key_1 = ctx => /*row*/ ctx[138].model.id;
    	validate_each_keys(ctx, each_value_3, get_each_context_3, get_key_1);

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		let child_ctx = get_each_context_3(ctx, each_value_3, i);
    		let key = get_key_1(child_ctx);
    		each2_lookup.set(key, each_blocks_3[i] = create_each_block_3(key, child_ctx));
    	}

    	let each_value_2 = /*$allTimeRanges*/ ctx[25];
    	validate_each_argument(each_value_2);
    	const get_key_2 = ctx => /*timeRange*/ ctx[135].model.id;
    	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key_2);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key_2(child_ctx);
    		each3_lookup.set(key, each_blocks_2[i] = create_each_block_2(key, child_ctx));
    	}

    	let each_value_1 = /*visibleTasks*/ ctx[20];
    	validate_each_argument(each_value_1);
    	const get_key_3 = ctx => /*task*/ ctx[132].model.id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key_3);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key_3(child_ctx);
    		each4_lookup.set(key, each_blocks_1[i] = create_each_block_1$1(key, child_ctx));
    	}

    	let each_value = /*ganttBodyModules*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div9 = element("div");

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				each_blocks_5[i].c();
    			}

    			t0 = space();
    			div8 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(columnheader.$$.fragment);
    			t1 = space();

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			t2 = space();
    			div7 = element("div");
    			div6 = element("div");
    			create_component(columns_1.$$.fragment);
    			t3 = space();
    			div4 = element("div");
    			div3 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t4 = space();
    			div5 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t5 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t6 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "header-container svelte-12fxs8g");
    			set_style(div0, "width", /*$_width*/ ctx[22] + "px");
    			add_location(div0, file$8$1, 575, 16, 20027);
    			attr_dev(div1, "class", "sg-header-scroller svelte-12fxs8g");
    			add_location(div1, file$8$1, 574, 12, 19948);
    			attr_dev(div2, "class", "sg-header svelte-12fxs8g");
    			add_render_callback(() => /*div2_elementresize_handler*/ ctx[124].call(div2));
    			toggle_class(div2, "right-scrollbar-visible", /*rightScrollbarVisible*/ ctx[15]);
    			add_location(div2, file$8$1, 573, 8, 19787);
    			set_style(div3, "transform", "translateY(" + /*paddingTop*/ ctx[17] + "px)");
    			add_location(div3, file$8$1, 589, 20, 20901);
    			attr_dev(div4, "class", "sg-rows svelte-12fxs8g");
    			set_style(div4, "height", /*rowContainerHeight*/ ctx[16] + "px");
    			add_location(div4, file$8$1, 588, 16, 20794);
    			attr_dev(div5, "class", "sg-foreground svelte-12fxs8g");
    			add_location(div5, file$8$1, 595, 16, 21166);
    			attr_dev(div6, "class", "content svelte-12fxs8g");
    			set_style(div6, "width", /*$_width*/ ctx[22] + "px");
    			add_location(div6, file$8$1, 586, 12, 20643);
    			attr_dev(div7, "class", "sg-timeline-body svelte-12fxs8g");
    			add_render_callback(() => /*div7_elementresize_handler*/ ctx[127].call(div7));
    			toggle_class(div7, "zooming", /*zooming*/ ctx[14]);
    			add_location(div7, file$8$1, 584, 8, 20429);
    			attr_dev(div8, "class", "sg-timeline sg-view svelte-12fxs8g");
    			add_location(div8, file$8$1, 572, 4, 19744);
    			attr_dev(div9, "class", div9_class_value = "sg-gantt " + /*classes*/ ctx[4] + " svelte-12fxs8g");
    			toggle_class(div9, "sg-disable-transition", !/*disableTransition*/ ctx[21]);
    			add_location(div9, file$8$1, 565, 0, 19274);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				each_blocks_5[i].m(div9, null);
    			}

    			append_dev(div9, t0);
    			append_dev(div9, div8);
    			append_dev(div8, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			mount_component(columnheader, div0, null);
    			append_dev(div0, t1);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].m(div0, null);
    			}

    			/*div2_binding*/ ctx[123](div2);
    			div2_resize_listener = add_resize_listener(div2, /*div2_elementresize_handler*/ ctx[124].bind(div2));
    			append_dev(div8, t2);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			mount_component(columns_1, div6, null);
    			append_dev(div6, t3);
    			append_dev(div6, div4);
    			append_dev(div4, div3);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].m(div3, null);
    			}

    			/*div4_binding*/ ctx[125](div4);
    			append_dev(div6, t4);
    			append_dev(div6, div5);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div5, null);
    			}

    			append_dev(div5, t5);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div5, null);
    			}

    			append_dev(div6, t6);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div6, null);
    			}

    			/*div7_binding*/ ctx[126](div7);
    			div7_resize_listener = add_resize_listener(div7, /*div7_elementresize_handler*/ ctx[127].bind(div7));
    			/*div9_binding*/ ctx[128](div9);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(ctx[42].call(null, div1)),
    					action_destroyer(ctx[41].call(null, div7)),
    					listen_dev(div7, "wheel", /*onwheel*/ ctx[44], false, false, false),
    					listen_dev(div9, "click", onEvent, false, false, false),
    					listen_dev(div9, "mouseover", onEvent, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*tableWidth, ganttElement, ganttTableModules, rowContainerHeight, paddingTop, paddingBottom, visibleRows*/ 983586 | dirty[1] & /*onResize, $$restProps*/ 36864) {
    				each_value_5 = /*ganttTableModules*/ ctx[5];
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks_5[i]) {
    						each_blocks_5[i].p(child_ctx, dirty);
    						transition_in(each_blocks_5[i], 1);
    					} else {
    						each_blocks_5[i] = create_each_block_5(child_ctx);
    						each_blocks_5[i].c();
    						transition_in(each_blocks_5[i], 1);
    						each_blocks_5[i].m(div9, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value_5.length; i < each_blocks_5.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			const columnheader_changes = {};
    			if (dirty[0] & /*headers*/ 1) columnheader_changes.headers = /*headers*/ ctx[0];
    			if (dirty[0] & /*columnUnit*/ 4) columnheader_changes.columnUnit = /*columnUnit*/ ctx[2];
    			if (dirty[0] & /*columnOffset*/ 8) columnheader_changes.columnOffset = /*columnOffset*/ ctx[3];
    			columnheader.$set(columnheader_changes);

    			if (dirty[0] & /*$allTimeRanges*/ 33554432) {
    				const each_value_4 = /*$allTimeRanges*/ ctx[25];
    				validate_each_argument(each_value_4);
    				group_outros();
    				validate_each_keys(ctx, each_value_4, get_each_context_4, get_key);
    				each_blocks_4 = update_keyed_each(each_blocks_4, dirty, get_key, 1, ctx, each_value_4, each1_lookup, div0, outro_and_destroy_block, create_each_block_4, null, get_each_context_4);
    				check_outros();
    			}

    			if (!current || dirty[0] & /*$_width*/ 4194304) {
    				set_style(div0, "width", /*$_width*/ ctx[22] + "px");
    			}

    			if (dirty[0] & /*rightScrollbarVisible*/ 32768) {
    				toggle_class(div2, "right-scrollbar-visible", /*rightScrollbarVisible*/ ctx[15]);
    			}

    			const columns_1_changes = {};
    			if (dirty[0] & /*columns*/ 8192) columns_1_changes.columns = /*columns*/ ctx[13];
    			if (dirty[0] & /*columnStrokeColor*/ 128) columns_1_changes.columnStrokeColor = /*columnStrokeColor*/ ctx[7];
    			if (dirty[0] & /*columnStrokeWidth*/ 256) columns_1_changes.columnStrokeWidth = /*columnStrokeWidth*/ ctx[8];
    			columns_1.$set(columns_1_changes);

    			if (dirty[0] & /*visibleRows*/ 524288) {
    				const each_value_3 = /*visibleRows*/ ctx[19];
    				validate_each_argument(each_value_3);
    				group_outros();
    				validate_each_keys(ctx, each_value_3, get_each_context_3, get_key_1);
    				each_blocks_3 = update_keyed_each(each_blocks_3, dirty, get_key_1, 1, ctx, each_value_3, each2_lookup, div3, outro_and_destroy_block, create_each_block_3, null, get_each_context_3);
    				check_outros();
    			}

    			if (!current || dirty[0] & /*paddingTop*/ 131072) {
    				set_style(div3, "transform", "translateY(" + /*paddingTop*/ ctx[17] + "px)");
    			}

    			if (!current || dirty[0] & /*rowContainerHeight*/ 65536) {
    				set_style(div4, "height", /*rowContainerHeight*/ ctx[16] + "px");
    			}

    			if (dirty[0] & /*$allTimeRanges*/ 33554432) {
    				const each_value_2 = /*$allTimeRanges*/ ctx[25];
    				validate_each_argument(each_value_2);
    				group_outros();
    				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key_2);
    				each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key_2, 1, ctx, each_value_2, each3_lookup, div5, outro_and_destroy_block, create_each_block_2, t5, get_each_context_2);
    				check_outros();
    			}

    			if (dirty[0] & /*visibleTasks*/ 1048576) {
    				const each_value_1 = /*visibleTasks*/ ctx[20];
    				validate_each_argument(each_value_1);
    				group_outros();
    				validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key_3);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key_3, 1, ctx, each_value_1, each4_lookup, div5, outro_and_destroy_block, create_each_block_1$1, null, get_each_context_1$1);
    				check_outros();
    			}

    			if (dirty[0] & /*ganttBodyModules, paddingTop, paddingBottom, visibleRows*/ 917568 | dirty[1] & /*$$restProps*/ 32768) {
    				each_value = /*ganttBodyModules*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div6, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*$_width*/ 4194304) {
    				set_style(div6, "width", /*$_width*/ ctx[22] + "px");
    			}

    			if (dirty[0] & /*zooming*/ 16384) {
    				toggle_class(div7, "zooming", /*zooming*/ ctx[14]);
    			}

    			if (!current || dirty[0] & /*classes*/ 16 && div9_class_value !== (div9_class_value = "sg-gantt " + /*classes*/ ctx[4] + " svelte-12fxs8g")) {
    				attr_dev(div9, "class", div9_class_value);
    			}

    			if (dirty[0] & /*classes, disableTransition*/ 2097168) {
    				toggle_class(div9, "sg-disable-transition", !/*disableTransition*/ ctx[21]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_5.length; i += 1) {
    				transition_in(each_blocks_5[i]);
    			}

    			transition_in(columnheader.$$.fragment, local);

    			for (let i = 0; i < each_value_4.length; i += 1) {
    				transition_in(each_blocks_4[i]);
    			}

    			transition_in(columns_1.$$.fragment, local);

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks_3[i]);
    			}

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_5 = each_blocks_5.filter(Boolean);

    			for (let i = 0; i < each_blocks_5.length; i += 1) {
    				transition_out(each_blocks_5[i]);
    			}

    			transition_out(columnheader.$$.fragment, local);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				transition_out(each_blocks_4[i]);
    			}

    			transition_out(columns_1.$$.fragment, local);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				transition_out(each_blocks_3[i]);
    			}

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			destroy_each(each_blocks_5, detaching);
    			destroy_component(columnheader);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].d();
    			}

    			/*div2_binding*/ ctx[123](null);
    			div2_resize_listener();
    			destroy_component(columns_1);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].d();
    			}

    			/*div4_binding*/ ctx[125](null);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].d();
    			}

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			destroy_each(each_blocks, detaching);
    			/*div7_binding*/ ctx[126](null);
    			div7_resize_listener();
    			/*div9_binding*/ ctx[128](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function assertSet(values) {
    	for (const name in values) {
    		if (values[name] == null) {
    			throw new Error(`"${name}" is not set`);
    		}
    	}
    }

    function toDateNum(date) {
    	return date instanceof Date ? date.valueOf() : date;
    }

    function add(a, b) {
    	if (a instanceof Date) {
    		a = a.valueOf();
    	}

    	if (b instanceof Date) {
    		b = b.valueOf();
    	}

    	return a + b;
    }

    function onModuleInit(module) {
    	
    }

    function instance$9($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"rows","tasks","timeRanges","rowPadding","rowHeight","from","to","minWidth","fitWidth","classes","headers","zoomLevels","taskContent","tableWidth","resizeHandleWidth","onTaskButtonClick","dateAdapter","magnetUnit","magnetOffset","columnUnit","columnOffset","ganttTableModules","ganttBodyModules","reflectOnParentRows","reflectOnChildRows","columnStrokeColor","columnStrokeWidth","taskElementHook","columnService","api","taskFactory","rowFactory","dndManager","timeRangeFactory","utils","refreshTimeRanges","refreshTasks","getRowContainer","selectTask","unselectTasks","scrollToRow","scrollToTask","updateTask","updateTasks","updateRow","updateRows","getRow","getTask","getTasks"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $_rowHeight;
    	let $_rowPadding;
    	let $_from;
    	let $_to;
    	let $_minWidth;
    	let $_fitWidth;
    	let $_width;
    	let $columnWidth;
    	let $dimensionsChanged;
    	let $taskStore;
    	let $hoveredRow;
    	let $selectedRow;
    	let $rowStore;
    	let $allTasks;
    	let $allRows;
    	let $rowTaskCache;
    	let $visibleHeight;
    	let $headerHeight;
    	let $allTimeRanges;
    	let $visibleWidth;
    	validate_store(taskStore, "taskStore");
    	component_subscribe($$self, taskStore, $$value => $$invalidate(105, $taskStore = $$value));
    	validate_store(rowStore, "rowStore");
    	component_subscribe($$self, rowStore, $$value => $$invalidate(108, $rowStore = $$value));
    	validate_store(allTasks, "allTasks");
    	component_subscribe($$self, allTasks, $$value => $$invalidate(109, $allTasks = $$value));
    	validate_store(allRows, "allRows");
    	component_subscribe($$self, allRows, $$value => $$invalidate(110, $allRows = $$value));
    	validate_store(rowTaskCache, "rowTaskCache");
    	component_subscribe($$self, rowTaskCache, $$value => $$invalidate(111, $rowTaskCache = $$value));
    	validate_store(allTimeRanges, "allTimeRanges");
    	component_subscribe($$self, allTimeRanges, $$value => $$invalidate(25, $allTimeRanges = $$value));

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let ganttElement;
    	let mainHeaderContainer;
    	let mainContainer;
    	let rowContainer;
    	let scrollables = [];
    	let mounted = false;
    	
    	
    	let { rows } = $$props;
    	let { tasks = [] } = $$props;
    	let { timeRanges = [] } = $$props;
    	assertSet({ rows });
    	let { rowPadding = 6 } = $$props;
    	let { rowHeight = 52 } = $$props;
    	const _rowHeight = writable(rowHeight);
    	validate_store(_rowHeight, "_rowHeight");
    	component_subscribe($$self, _rowHeight, value => $$invalidate(97, $_rowHeight = value));
    	const _rowPadding = writable(rowPadding);
    	validate_store(_rowPadding, "_rowPadding");
    	component_subscribe($$self, _rowPadding, value => $$invalidate(98, $_rowPadding = value));
    	let { from } = $$props;
    	let { to } = $$props;
    	assertSet({ from, to });
    	const _from = writable(toDateNum(from));
    	validate_store(_from, "_from");
    	component_subscribe($$self, _from, value => $$invalidate(99, $_from = value));
    	const _to = writable(toDateNum(to));
    	validate_store(_to, "_to");
    	component_subscribe($$self, _to, value => $$invalidate(100, $_to = value));
    	let { minWidth = 800 } = $$props;
    	let { fitWidth = false } = $$props;
    	const _minWidth = writable(minWidth);
    	validate_store(_minWidth, "_minWidth");
    	component_subscribe($$self, _minWidth, value => $$invalidate(101, $_minWidth = value));
    	const _fitWidth = writable(fitWidth);
    	validate_store(_fitWidth, "_fitWidth");
    	component_subscribe($$self, _fitWidth, value => $$invalidate(102, $_fitWidth = value));
    	let { classes = [] } = $$props;
    	let { headers = [{ unit: "day", format: "MMMM Do" }, { unit: "hour", format: "H:mm" }] } = $$props;

    	let { zoomLevels = [
    		{
    			headers: [{ unit: "day", format: "DD.MM.YYYY" }, { unit: "hour", format: "HH" }],
    			minWidth: 800,
    			fitWidth: true
    		},
    		{
    			headers: [
    				{ unit: "hour", format: "ddd D/M, H A" },
    				{ unit: "minute", format: "mm", offset: 15 }
    			],
    			minWidth: 5000,
    			fitWidth: false
    		}
    	] } = $$props;

    	let { taskContent = null } = $$props;
    	let { tableWidth = 100 } = $$props;
    	let { resizeHandleWidth = 10 } = $$props;
    	let { onTaskButtonClick = null } = $$props;
    	let { dateAdapter = new NoopSvelteGanttDateAdapter() } = $$props;
    	let { magnetUnit = "minute" } = $$props;
    	let { magnetOffset = 15 } = $$props;
    	let magnetDuration;
    	setMagnetDuration(magnetUnit, magnetOffset);

    	function setMagnetDuration(unit, offset) {
    		if (unit && offset) {
    			$$invalidate(88, magnetDuration = getDuration(unit, offset));
    		}
    	}

    	let { columnUnit = "minute" } = $$props;
    	let { columnOffset = 15 } = $$props;
    	let columnDuration;
    	setColumnDuration(columnUnit, columnOffset);

    	function setColumnDuration(unit, offset) {
    		if (unit && offset) {
    			$$invalidate(89, columnDuration = getDuration(unit, offset));
    		}
    	}

    	let { ganttTableModules = [] } = $$props;
    	let { ganttBodyModules = [] } = $$props;
    	let { reflectOnParentRows = true } = $$props;
    	let { reflectOnChildRows = false } = $$props;
    	let { columnStrokeColor } = $$props;
    	let { columnStrokeWidth } = $$props;
    	let { taskElementHook = null } = $$props;
    	const visibleWidth = writable(null);
    	validate_store(visibleWidth, "visibleWidth");
    	component_subscribe($$self, visibleWidth, value => $$invalidate(26, $visibleWidth = value));
    	const visibleHeight = writable(null);
    	validate_store(visibleHeight, "visibleHeight");
    	component_subscribe($$self, visibleHeight, value => $$invalidate(23, $visibleHeight = value));
    	const headerHeight = writable(null);
    	validate_store(headerHeight, "headerHeight");
    	component_subscribe($$self, headerHeight, value => $$invalidate(24, $headerHeight = value));

    	const _width = derived([visibleWidth, _minWidth, _fitWidth], ([visible, min, stretch]) => {
    		return stretch && visible > min ? visible : min;
    	});

    	validate_store(_width, "_width");
    	component_subscribe($$self, _width, value => $$invalidate(22, $_width = value));

    	const columnService = {
    		getColumnByDate(date) {
    			const pair = findByDate(columns, date);
    			return !pair[0] ? pair[1] : pair[0];
    		},
    		getColumnByPosition(x) {
    			const pair = findByPosition(columns, x);
    			return !pair[0] ? pair[1] : pair[0];
    		},
    		getPositionByDate(date) {
    			if (!date) return null;
    			const column = this.getColumnByDate(date);
    			let durationTo = date - column.from;
    			const position = durationTo / column.duration * column.width;

    			//multiples - skip every nth col, use other duration
    			return column.left + position;
    		},
    		getDateByPosition(x) {
    			const column = this.getColumnByPosition(x);
    			x = x - column.left;
    			let positionDuration = column.duration / column.width * x;
    			const date = column.from + positionDuration;
    			return date;
    		},
    		/**
     *
     * @param {number} date - Date
     * @returns {number} rounded date passed as parameter
     */
    		roundTo(date) {
    			let value = Math.round(date / magnetDuration) * magnetDuration;
    			return value;
    		}
    	};

    	const columnWidth = writable(getPositionByDate($_from + columnDuration, $_from, $_to, $_width) | 0);
    	validate_store(columnWidth, "columnWidth");
    	component_subscribe($$self, columnWidth, value => $$invalidate(103, $columnWidth = value));
    	let columnCount = Math.ceil($_width / $columnWidth);
    	let columns = getColumns($_from, columnCount, columnDuration, $columnWidth);

    	function getColumns(from, count, dur, width) {
    		if (!isFinite(count)) throw new Error("column count is not a finite number");
    		if (width <= 0) throw new Error("column width is not a positive number");
    		let columns = [];
    		let columnFrom = from;
    		let left = 0;

    		for (let i = 0; i < count; i++) {
    			const from = columnFrom;
    			const to = columnFrom + dur;
    			const duration = to - from;
    			columns.push({ width, from, left, duration });
    			left += width;
    			columnFrom = to;
    		}

    		return columns;
    	}

    	const dimensionsChanged = derived([columnWidth, _from, _to], () => ({}));
    	validate_store(dimensionsChanged, "dimensionsChanged");
    	component_subscribe($$self, dimensionsChanged, value => $$invalidate(104, $dimensionsChanged = value));

    	setContext("dimensions", {
    		from: _from,
    		to: _to,
    		width: _width,
    		visibleWidth,
    		visibleHeight,
    		headerHeight,
    		dimensionsChanged
    	});

    	setContext("options", {
    		dateAdapter,
    		taskElementHook,
    		taskContent,
    		rowPadding: _rowPadding,
    		rowHeight: _rowHeight,
    		resizeHandleWidth,
    		reflectOnParentRows,
    		reflectOnChildRows,
    		onTaskButtonClick
    	});

    	const hoveredRow = writable(null);
    	validate_store(hoveredRow, "hoveredRow");
    	component_subscribe($$self, hoveredRow, value => $$invalidate(106, $hoveredRow = value));
    	const selectedRow = writable(null);
    	validate_store(selectedRow, "selectedRow");
    	component_subscribe($$self, selectedRow, value => $$invalidate(107, $selectedRow = value));
    	const ganttContext = { scrollables, hoveredRow, selectedRow };
    	setContext("gantt", ganttContext);

    	onMount(() => {
    		Object.assign(ganttContext, {
    			rowContainer,
    			mainContainer,
    			mainHeaderContainer
    		});

    		api.registerEvent("tasks", "move");
    		api.registerEvent("tasks", "select");
    		api.registerEvent("tasks", "switchRow");
    		api.registerEvent("tasks", "moveEnd");
    		api.registerEvent("tasks", "change");
    		api.registerEvent("tasks", "changed");
    		api.registerEvent("gantt", "viewChanged");
    		$$invalidate(87, mounted = true);
    	});

    	onDelegatedEvent("click", "data-task-id", (event, data, target) => {
    		const taskId = +data;

    		if (event.ctrlKey) {
    			selectionManager.toggleSelection(taskId);
    		} else {
    			selectionManager.selectSingle(taskId);
    		}

    		api["tasks"].raise.select($taskStore.entities[taskId]);
    	});

    	onDelegatedEvent("mouseover", "data-row-id", (event, data, target) => {
    		set_store_value(hoveredRow, $hoveredRow = +data);
    	});

    	onDelegatedEvent("click", "data-row-id", (event, data, target) => {
    		set_store_value(selectedRow, $selectedRow = +data);
    	});

    	onDestroy(() => {
    		offDelegatedEvent("click", "data-task-id");
    		offDelegatedEvent("click", "data-row-id");
    	});

    	let __scrollTop = 0;
    	let __scrollLeft = 0;

    	function scrollable(node) {
    		const onscroll = event => {
    			const { scrollTop, scrollLeft } = node;

    			scrollables.forEach(scrollable => {
    				if (scrollable.orientation === "horizontal") {
    					scrollable.node.scrollLeft = scrollLeft;
    				} else {
    					scrollable.node.scrollTop = scrollTop;
    				}
    			});

    			$$invalidate(91, __scrollTop = scrollTop);
    			__scrollLeft = scrollLeft;
    		};

    		node.addEventListener("scroll", onscroll);

    		return {
    			destroy() {
    				node.removeEventListener("scroll", onscroll, false);
    			}
    		};
    	}

    	function horizontalScrollListener(node) {
    		scrollables.push({ node, orientation: "horizontal" });
    	}

    	function onResize(event) {
    		$$invalidate(1, tableWidth = event.detail.left);
    	}

    	let zoomLevel = 0;
    	let zooming = false;

    	function onwheel(event) {
    		return __awaiter(this, void 0, void 0, function* () {
    			if (event.ctrlKey) {
    				event.preventDefault();
    				const prevZoomLevel = zoomLevel;

    				if (event.deltaY > 0) {
    					zoomLevel = Math.max(zoomLevel - 1, 0);
    				} else {
    					zoomLevel = Math.min(zoomLevel + 1, zoomLevels.length - 1);
    				}

    				if (prevZoomLevel != zoomLevel && zoomLevels[zoomLevel]) {
    					const options = Object.assign(
    						{
    							columnUnit,
    							columnOffset,
    							minWidth: $_minWidth
    						},
    						zoomLevels[zoomLevel]
    					);

    					const scale = options.minWidth / $_width;
    					const node = mainContainer;
    					const mousepos = getRelativePos(node, event);
    					const before = node.scrollLeft + mousepos.x;
    					const after = before * scale;
    					const scrollLeft = after - mousepos.x + node.clientWidth / 2;
    					console.log("scrollLeft", scrollLeft);
    					$$invalidate(2, columnUnit = options.columnUnit);
    					$$invalidate(3, columnOffset = options.columnOffset);
    					set_store_value(_minWidth, $_minWidth = options.minWidth);
    					if (options.headers) $$invalidate(0, headers = options.headers);
    					if (options.fitWidth) set_store_value(_fitWidth, $_fitWidth = options.fitWidth);
    					api["gantt"].raise.viewChanged();
    					$$invalidate(14, zooming = true);
    					yield tick();
    					node.scrollLeft = scrollLeft;
    					$$invalidate(14, zooming = false);
    				}
    			}
    		});
    	}

    	function onDateSelected(event) {
    		set_store_value(_from, $_from = event.detail.from);
    		set_store_value(_to, $_to = event.detail.to);
    	}

    	function initRows(rowsData) {
    		const rows = rowFactory.createRows(rowsData);
    		rowStore.addAll(rows);
    	}

    	function initTasks(taskData) {
    		return __awaiter(this, void 0, void 0, function* () {
    			yield tick();
    			const tasks = [];
    			const opts = { rowPadding: $_rowPadding };

    			taskData.forEach(t => {
    				const task = taskFactory.createTask(t);
    				const row = $rowStore.entities[task.model.resourceId];
    				task.reflections = [];

    				if (reflectOnChildRows && row.allChildren) {
    					row.allChildren.forEach(r => {
    						const reflectedTask = reflectTask(task, r, opts);
    						task.reflections.push(reflectedTask.model.id);
    						tasks.push(reflectedTask);
    					});
    				}

    				if (reflectOnParentRows && row.allParents.length > 0) {
    					row.allParents.forEach(r => {
    						const reflectedTask = reflectTask(task, r, opts);
    						task.reflections.push(reflectedTask.model.id);
    						tasks.push(reflectedTask);
    					});
    				}

    				tasks.push(task);
    			});

    			taskStore.addAll(tasks);
    		});
    	}

    	function initTimeRanges(timeRangeData) {
    		const timeRanges = timeRangeData.map(timeRange => {
    			return timeRangeFactory.create(timeRange);
    		});

    		timeRangeStore.addAll(timeRanges);
    	}

    	function tickWithoutCSSTransition() {
    		return __awaiter(this, void 0, void 0, function* () {
    			$$invalidate(21, disableTransition = false);
    			yield tick();
    			ganttElement.offsetHeight; // force a reflow
    			$$invalidate(21, disableTransition = true);
    		});
    	}

    	const api = new GanttApi();
    	const selectionManager = new SelectionManager();
    	const taskFactory = new TaskFactory(columnService);
    	const rowFactory = new RowFactory();
    	const dndManager = new DragDropManager(rowStore);
    	const timeRangeFactory = new TimeRangeFactory(columnService);
    	const utils = new GanttUtils();

    	setContext("services", {
    		utils,
    		api,
    		dndManager,
    		selectionManager,
    		columnService
    	});

    	function refreshTimeRanges() {
    		timeRangeStore._update(({ ids, entities }) => {
    			ids.forEach(id => {
    				const timeRange = entities[id];
    				const newLeft = columnService.getPositionByDate(timeRange.model.from) | 0;
    				const newRight = columnService.getPositionByDate(timeRange.model.to) | 0;
    				timeRange.left = newLeft;
    				timeRange.width = newRight - newLeft;
    			});

    			return { ids, entities };
    		});
    	}

    	function refreshTasks() {
    		$allTasks.forEach(task => {
    			const newLeft = columnService.getPositionByDate(task.model.from) | 0;
    			const newRight = columnService.getPositionByDate(task.model.to) | 0;
    			task.left = newLeft;
    			task.width = newRight - newLeft;
    		});

    		taskStore.refresh();
    	}

    	function getRowContainer() {
    		return rowContainer;
    	}

    	function selectTask(id) {
    		const task = $taskStore.entities[id];

    		if (task) {
    			selectionManager.selectSingle(task);
    		}
    	}

    	function unselectTasks() {
    		selectionManager.clearSelection();
    	}

    	function scrollToRow(id, scrollBehavior = "auto") {
    		const { scrollTop, clientHeight } = mainContainer;
    		const index = $allRows.findIndex(r => r.model.id == id);
    		if (index === -1) return;
    		const targetTop = index * rowHeight;

    		if (targetTop < scrollTop) {
    			mainContainer.scrollTo({ top: targetTop, behavior: scrollBehavior });
    		}

    		if (targetTop > scrollTop + clientHeight) {
    			mainContainer.scrollTo({
    				top: targetTop + rowHeight - clientHeight,
    				behavior: scrollBehavior
    			});
    		}
    	}

    	function scrollToTask(id, scrollBehavior = "auto") {
    		const { scrollLeft, scrollTop, clientWidth, clientHeight } = mainContainer;
    		const task = $taskStore.entities[id];
    		if (!task) return;
    		const targetLeft = task.left;
    		const rowIndex = $allRows.findIndex(r => r.model.id == task.model.resourceId);
    		const targetTop = rowIndex * rowHeight;

    		const options = {
    			top: undefined,
    			left: undefined,
    			behavior: scrollBehavior
    		};

    		if (targetLeft < scrollLeft) {
    			options.left = targetLeft;
    		}

    		if (targetLeft > scrollLeft + clientWidth) {
    			options.left = targetLeft + task.width - clientWidth;
    		}

    		if (targetTop < scrollTop) {
    			options.top = targetTop;
    		}

    		if (targetTop > scrollTop + clientHeight) {
    			options.top = targetTop + rowHeight - clientHeight;
    		}

    		mainContainer.scrollTo(options);
    	}

    	function updateTask(model) {
    		const task = taskFactory.createTask(model);
    		taskStore.upsert(task);
    	}

    	function updateTasks(taskModels) {
    		const tasks = taskModels.map(model => taskFactory.createTask(model));
    		taskStore.upsertAll(tasks);
    	}

    	function updateRow(model) {
    		const row = rowFactory.createRow(model, null);
    		rowStore.upsert(row);
    	}

    	function updateRows(rowModels) {
    		const rows = rowModels.map(model => rowFactory.createRow(model, null));
    		rowStore.upsertAll(rows);
    	}

    	function getRow(resourceId) {
    		return $rowStore.entities[resourceId];
    	}

    	function getTask(id) {
    		return $taskStore.entities[id];
    	}

    	function getTasks(resourceId) {
    		if ($rowTaskCache[resourceId]) {
    			return $rowTaskCache[resourceId].map(id => $taskStore.entities[id]);
    		}

    		return null;
    	}

    	let filteredRows = [];
    	let rightScrollbarVisible;
    	let rowContainerHeight;
    	let startIndex;
    	let endIndex;
    	let paddingTop = 0;
    	let paddingBottom = 0;
    	let visibleRows = [];
    	let visibleTasks;
    	let disableTransition = true;
    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Gantt", $$slots, []);

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(10, mainHeaderContainer = $$value);
    		});
    	}

    	function div2_elementresize_handler() {
    		$headerHeight = this.clientHeight;
    		headerHeight.set($headerHeight);
    	}

    	function div4_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(12, rowContainer = $$value);
    		});
    	}

    	function div7_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(11, mainContainer = $$value);
    		});
    	}

    	function div7_elementresize_handler() {
    		$visibleHeight = this.clientHeight;
    		visibleHeight.set($visibleHeight);
    		$visibleWidth = this.clientWidth;
    		visibleWidth.set($visibleWidth);
    	}

    	function div9_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(9, ganttElement = $$value);
    		});
    	}

    	$$self.$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(46, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("rows" in $$new_props) $$invalidate(50, rows = $$new_props.rows);
    		if ("tasks" in $$new_props) $$invalidate(51, tasks = $$new_props.tasks);
    		if ("timeRanges" in $$new_props) $$invalidate(52, timeRanges = $$new_props.timeRanges);
    		if ("rowPadding" in $$new_props) $$invalidate(53, rowPadding = $$new_props.rowPadding);
    		if ("rowHeight" in $$new_props) $$invalidate(54, rowHeight = $$new_props.rowHeight);
    		if ("from" in $$new_props) $$invalidate(55, from = $$new_props.from);
    		if ("to" in $$new_props) $$invalidate(56, to = $$new_props.to);
    		if ("minWidth" in $$new_props) $$invalidate(57, minWidth = $$new_props.minWidth);
    		if ("fitWidth" in $$new_props) $$invalidate(58, fitWidth = $$new_props.fitWidth);
    		if ("classes" in $$new_props) $$invalidate(4, classes = $$new_props.classes);
    		if ("headers" in $$new_props) $$invalidate(0, headers = $$new_props.headers);
    		if ("zoomLevels" in $$new_props) $$invalidate(59, zoomLevels = $$new_props.zoomLevels);
    		if ("taskContent" in $$new_props) $$invalidate(60, taskContent = $$new_props.taskContent);
    		if ("tableWidth" in $$new_props) $$invalidate(1, tableWidth = $$new_props.tableWidth);
    		if ("resizeHandleWidth" in $$new_props) $$invalidate(61, resizeHandleWidth = $$new_props.resizeHandleWidth);
    		if ("onTaskButtonClick" in $$new_props) $$invalidate(62, onTaskButtonClick = $$new_props.onTaskButtonClick);
    		if ("dateAdapter" in $$new_props) $$invalidate(63, dateAdapter = $$new_props.dateAdapter);
    		if ("magnetUnit" in $$new_props) $$invalidate(64, magnetUnit = $$new_props.magnetUnit);
    		if ("magnetOffset" in $$new_props) $$invalidate(65, magnetOffset = $$new_props.magnetOffset);
    		if ("columnUnit" in $$new_props) $$invalidate(2, columnUnit = $$new_props.columnUnit);
    		if ("columnOffset" in $$new_props) $$invalidate(3, columnOffset = $$new_props.columnOffset);
    		if ("ganttTableModules" in $$new_props) $$invalidate(5, ganttTableModules = $$new_props.ganttTableModules);
    		if ("ganttBodyModules" in $$new_props) $$invalidate(6, ganttBodyModules = $$new_props.ganttBodyModules);
    		if ("reflectOnParentRows" in $$new_props) $$invalidate(66, reflectOnParentRows = $$new_props.reflectOnParentRows);
    		if ("reflectOnChildRows" in $$new_props) $$invalidate(67, reflectOnChildRows = $$new_props.reflectOnChildRows);
    		if ("columnStrokeColor" in $$new_props) $$invalidate(7, columnStrokeColor = $$new_props.columnStrokeColor);
    		if ("columnStrokeWidth" in $$new_props) $$invalidate(8, columnStrokeWidth = $$new_props.columnStrokeWidth);
    		if ("taskElementHook" in $$new_props) $$invalidate(68, taskElementHook = $$new_props.taskElementHook);
    	};

    	$$self.$capture_state = () => ({
    		__awaiter,
    		onMount,
    		setContext,
    		tick,
    		onDestroy,
    		writable,
    		derived,
    		ganttElement,
    		mainHeaderContainer,
    		mainContainer,
    		rowContainer,
    		scrollables,
    		mounted,
    		rowStore,
    		taskStore,
    		timeRangeStore,
    		allTasks,
    		allRows,
    		allTimeRanges,
    		rowTaskCache,
    		Task,
    		Row,
    		TimeRange,
    		TimeRangeHeader,
    		Milestone,
    		Columns,
    		ColumnHeader,
    		Resizer,
    		GanttUtils,
    		getPositionByDate,
    		getRelativePos,
    		debounce,
    		throttle,
    		SelectionManager,
    		GanttApi,
    		TaskFactory,
    		reflectTask,
    		RowFactory,
    		TimeRangeFactory,
    		DragDropManager,
    		findByPosition,
    		findByDate,
    		onEvent,
    		onDelegatedEvent,
    		offDelegatedEvent,
    		NoopSvelteGanttDateAdapter,
    		getDuration,
    		assertSet,
    		rows,
    		tasks,
    		timeRanges,
    		rowPadding,
    		rowHeight,
    		_rowHeight,
    		_rowPadding,
    		toDateNum,
    		from,
    		to,
    		_from,
    		_to,
    		minWidth,
    		fitWidth,
    		_minWidth,
    		_fitWidth,
    		classes,
    		headers,
    		zoomLevels,
    		taskContent,
    		tableWidth,
    		resizeHandleWidth,
    		onTaskButtonClick,
    		dateAdapter,
    		magnetUnit,
    		magnetOffset,
    		magnetDuration,
    		setMagnetDuration,
    		columnUnit,
    		columnOffset,
    		columnDuration,
    		setColumnDuration,
    		ganttTableModules,
    		ganttBodyModules,
    		reflectOnParentRows,
    		reflectOnChildRows,
    		columnStrokeColor,
    		columnStrokeWidth,
    		taskElementHook,
    		visibleWidth,
    		visibleHeight,
    		headerHeight,
    		_width,
    		columnService,
    		add,
    		columnWidth,
    		columnCount,
    		columns,
    		getColumns,
    		dimensionsChanged,
    		hoveredRow,
    		selectedRow,
    		ganttContext,
    		__scrollTop,
    		__scrollLeft,
    		scrollable,
    		horizontalScrollListener,
    		onResize,
    		zoomLevel,
    		zooming,
    		onwheel,
    		onDateSelected,
    		initRows,
    		initTasks,
    		initTimeRanges,
    		onModuleInit,
    		tickWithoutCSSTransition,
    		api,
    		selectionManager,
    		taskFactory,
    		rowFactory,
    		dndManager,
    		timeRangeFactory,
    		utils,
    		refreshTimeRanges,
    		refreshTasks,
    		getRowContainer,
    		selectTask,
    		unselectTasks,
    		scrollToRow,
    		scrollToTask,
    		updateTask,
    		updateTasks,
    		updateRow,
    		updateRows,
    		getRow,
    		getTask,
    		getTasks,
    		filteredRows,
    		rightScrollbarVisible,
    		rowContainerHeight,
    		startIndex,
    		endIndex,
    		paddingTop,
    		paddingBottom,
    		visibleRows,
    		visibleTasks,
    		disableTransition,
    		$_rowHeight,
    		$_rowPadding,
    		$_from,
    		$_to,
    		$_minWidth,
    		$_fitWidth,
    		$_width,
    		$columnWidth,
    		$dimensionsChanged,
    		$taskStore,
    		$hoveredRow,
    		$selectedRow,
    		$rowStore,
    		$allTasks,
    		$allRows,
    		$rowTaskCache,
    		$visibleHeight,
    		$headerHeight,
    		$allTimeRanges,
    		$visibleWidth
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("__awaiter" in $$props) __awaiter = $$new_props.__awaiter;
    		if ("ganttElement" in $$props) $$invalidate(9, ganttElement = $$new_props.ganttElement);
    		if ("mainHeaderContainer" in $$props) $$invalidate(10, mainHeaderContainer = $$new_props.mainHeaderContainer);
    		if ("mainContainer" in $$props) $$invalidate(11, mainContainer = $$new_props.mainContainer);
    		if ("rowContainer" in $$props) $$invalidate(12, rowContainer = $$new_props.rowContainer);
    		if ("scrollables" in $$props) scrollables = $$new_props.scrollables;
    		if ("mounted" in $$props) $$invalidate(87, mounted = $$new_props.mounted);
    		if ("rows" in $$props) $$invalidate(50, rows = $$new_props.rows);
    		if ("tasks" in $$props) $$invalidate(51, tasks = $$new_props.tasks);
    		if ("timeRanges" in $$props) $$invalidate(52, timeRanges = $$new_props.timeRanges);
    		if ("rowPadding" in $$props) $$invalidate(53, rowPadding = $$new_props.rowPadding);
    		if ("rowHeight" in $$props) $$invalidate(54, rowHeight = $$new_props.rowHeight);
    		if ("from" in $$props) $$invalidate(55, from = $$new_props.from);
    		if ("to" in $$props) $$invalidate(56, to = $$new_props.to);
    		if ("minWidth" in $$props) $$invalidate(57, minWidth = $$new_props.minWidth);
    		if ("fitWidth" in $$props) $$invalidate(58, fitWidth = $$new_props.fitWidth);
    		if ("classes" in $$props) $$invalidate(4, classes = $$new_props.classes);
    		if ("headers" in $$props) $$invalidate(0, headers = $$new_props.headers);
    		if ("zoomLevels" in $$props) $$invalidate(59, zoomLevels = $$new_props.zoomLevels);
    		if ("taskContent" in $$props) $$invalidate(60, taskContent = $$new_props.taskContent);
    		if ("tableWidth" in $$props) $$invalidate(1, tableWidth = $$new_props.tableWidth);
    		if ("resizeHandleWidth" in $$props) $$invalidate(61, resizeHandleWidth = $$new_props.resizeHandleWidth);
    		if ("onTaskButtonClick" in $$props) $$invalidate(62, onTaskButtonClick = $$new_props.onTaskButtonClick);
    		if ("dateAdapter" in $$props) $$invalidate(63, dateAdapter = $$new_props.dateAdapter);
    		if ("magnetUnit" in $$props) $$invalidate(64, magnetUnit = $$new_props.magnetUnit);
    		if ("magnetOffset" in $$props) $$invalidate(65, magnetOffset = $$new_props.magnetOffset);
    		if ("magnetDuration" in $$props) $$invalidate(88, magnetDuration = $$new_props.magnetDuration);
    		if ("columnUnit" in $$props) $$invalidate(2, columnUnit = $$new_props.columnUnit);
    		if ("columnOffset" in $$props) $$invalidate(3, columnOffset = $$new_props.columnOffset);
    		if ("columnDuration" in $$props) $$invalidate(89, columnDuration = $$new_props.columnDuration);
    		if ("ganttTableModules" in $$props) $$invalidate(5, ganttTableModules = $$new_props.ganttTableModules);
    		if ("ganttBodyModules" in $$props) $$invalidate(6, ganttBodyModules = $$new_props.ganttBodyModules);
    		if ("reflectOnParentRows" in $$props) $$invalidate(66, reflectOnParentRows = $$new_props.reflectOnParentRows);
    		if ("reflectOnChildRows" in $$props) $$invalidate(67, reflectOnChildRows = $$new_props.reflectOnChildRows);
    		if ("columnStrokeColor" in $$props) $$invalidate(7, columnStrokeColor = $$new_props.columnStrokeColor);
    		if ("columnStrokeWidth" in $$props) $$invalidate(8, columnStrokeWidth = $$new_props.columnStrokeWidth);
    		if ("taskElementHook" in $$props) $$invalidate(68, taskElementHook = $$new_props.taskElementHook);
    		if ("columnCount" in $$props) $$invalidate(90, columnCount = $$new_props.columnCount);
    		if ("columns" in $$props) $$invalidate(13, columns = $$new_props.columns);
    		if ("__scrollTop" in $$props) $$invalidate(91, __scrollTop = $$new_props.__scrollTop);
    		if ("__scrollLeft" in $$props) __scrollLeft = $$new_props.__scrollLeft;
    		if ("zoomLevel" in $$props) zoomLevel = $$new_props.zoomLevel;
    		if ("zooming" in $$props) $$invalidate(14, zooming = $$new_props.zooming);
    		if ("filteredRows" in $$props) $$invalidate(94, filteredRows = $$new_props.filteredRows);
    		if ("rightScrollbarVisible" in $$props) $$invalidate(15, rightScrollbarVisible = $$new_props.rightScrollbarVisible);
    		if ("rowContainerHeight" in $$props) $$invalidate(16, rowContainerHeight = $$new_props.rowContainerHeight);
    		if ("startIndex" in $$props) $$invalidate(95, startIndex = $$new_props.startIndex);
    		if ("endIndex" in $$props) $$invalidate(96, endIndex = $$new_props.endIndex);
    		if ("paddingTop" in $$props) $$invalidate(17, paddingTop = $$new_props.paddingTop);
    		if ("paddingBottom" in $$props) $$invalidate(18, paddingBottom = $$new_props.paddingBottom);
    		if ("visibleRows" in $$props) $$invalidate(19, visibleRows = $$new_props.visibleRows);
    		if ("visibleTasks" in $$props) $$invalidate(20, visibleTasks = $$new_props.visibleTasks);
    		if ("disableTransition" in $$props) $$invalidate(21, disableTransition = $$new_props.disableTransition);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*rows*/ 524288 | $$self.$$.dirty[2] & /*mounted*/ 33554432) {
    			 if (mounted) initRows(rows);
    		}

    		if ($$self.$$.dirty[1] & /*tasks*/ 1048576 | $$self.$$.dirty[2] & /*mounted*/ 33554432) {
    			 if (mounted) initTasks(tasks);
    		}

    		if ($$self.$$.dirty[1] & /*timeRanges*/ 2097152 | $$self.$$.dirty[2] & /*mounted*/ 33554432) {
    			 if (mounted) initTimeRanges(timeRanges);
    		}

    		if ($$self.$$.dirty[1] & /*rowHeight*/ 8388608) {
    			 set_store_value(_rowHeight, $_rowHeight = rowHeight);
    		}

    		if ($$self.$$.dirty[1] & /*rowPadding*/ 4194304) {
    			 set_store_value(_rowPadding, $_rowPadding = rowPadding);
    		}

    		if ($$self.$$.dirty[1] & /*from*/ 16777216) {
    			 set_store_value(_from, $_from = toDateNum(from));
    		}

    		if ($$self.$$.dirty[1] & /*to*/ 33554432) {
    			 set_store_value(_to, $_to = toDateNum(to));
    		}

    		if ($$self.$$.dirty[1] & /*minWidth, fitWidth*/ 201326592) {
    			 {
    				set_store_value(_minWidth, $_minWidth = minWidth);
    				set_store_value(_fitWidth, $_fitWidth = fitWidth);
    			}
    		}

    		if ($$self.$$.dirty[2] & /*magnetUnit, magnetOffset*/ 12) {
    			 setMagnetDuration(magnetUnit, magnetOffset);
    		}

    		if ($$self.$$.dirty[0] & /*columnUnit, columnOffset*/ 12) {
    			 setColumnDuration(columnUnit, columnOffset);
    		}

    		if ($$self.$$.dirty[0] & /*$_width*/ 4194304 | $$self.$$.dirty[2] & /*columnDuration*/ 134217728 | $$self.$$.dirty[3] & /*$_from, $_to*/ 192) {
    			 set_store_value(columnWidth, $columnWidth = getPositionByDate($_from + columnDuration, $_from, $_to, $_width) | 0);
    		}

    		if ($$self.$$.dirty[0] & /*$_width*/ 4194304 | $$self.$$.dirty[3] & /*$columnWidth*/ 1024) {
    			 $$invalidate(90, columnCount = Math.ceil($_width / $columnWidth));
    		}

    		if ($$self.$$.dirty[2] & /*columnCount, columnDuration*/ 402653184 | $$self.$$.dirty[3] & /*$_from, $columnWidth*/ 1088) {
    			 $$invalidate(13, columns = getColumns($_from, columnCount, columnDuration, $columnWidth));
    		}

    		if ($$self.$$.dirty[3] & /*$dimensionsChanged*/ 2048) {
    			 {
    				if ($dimensionsChanged) {
    					refreshTasks();
    					refreshTimeRanges();
    				}
    			}
    		}

    		if ($$self.$$.dirty[3] & /*$_rowPadding, $rowStore*/ 32800) {
    			 {
    				$$invalidate(47, taskFactory.rowPadding = $_rowPadding, taskFactory);
    				$$invalidate(47, taskFactory.rowEntities = $rowStore.entities, taskFactory);
    			}
    		}

    		if ($$self.$$.dirty[1] & /*rowHeight*/ 8388608) {
    			 $$invalidate(48, rowFactory.rowHeight = rowHeight, rowFactory);
    		}

    		if ($$self.$$.dirty[0] & /*$_width*/ 4194304 | $$self.$$.dirty[2] & /*magnetOffset, magnetUnit, magnetDuration, columnCount, columnDuration*/ 469762060 | $$self.$$.dirty[3] & /*$_from, $_to, $columnWidth*/ 1216) {
    			 {
    				$$invalidate(49, utils.from = $_from, utils);
    				$$invalidate(49, utils.to = $_to, utils);
    				$$invalidate(49, utils.width = $_width, utils);
    				$$invalidate(49, utils.magnetOffset = magnetOffset, utils);
    				$$invalidate(49, utils.magnetUnit = magnetUnit, utils);
    				$$invalidate(49, utils.magnetDuration = magnetDuration, utils);
    				$$invalidate(49, utils.totalColumnDuration = columnCount * columnDuration, utils);
    				$$invalidate(49, utils.totalColumnWidth = columnCount * $columnWidth, utils);
    			}
    		}

    		if ($$self.$$.dirty[3] & /*$allRows*/ 131072) {
    			 $$invalidate(94, filteredRows = $allRows.filter(row => !row.hidden));
    		}

    		if ($$self.$$.dirty[1] & /*rowHeight*/ 8388608 | $$self.$$.dirty[3] & /*filteredRows*/ 2) {
    			 $$invalidate(16, rowContainerHeight = filteredRows.length * rowHeight);
    		}

    		if ($$self.$$.dirty[0] & /*rowContainerHeight, $visibleHeight*/ 8454144) {
    			 $$invalidate(15, rightScrollbarVisible = rowContainerHeight > $visibleHeight);
    		}

    		if ($$self.$$.dirty[1] & /*rowHeight*/ 8388608 | $$self.$$.dirty[2] & /*__scrollTop*/ 536870912) {
    			 $$invalidate(95, startIndex = Math.floor(__scrollTop / rowHeight));
    		}

    		if ($$self.$$.dirty[0] & /*$visibleHeight*/ 8388608 | $$self.$$.dirty[1] & /*rowHeight*/ 8388608 | $$self.$$.dirty[3] & /*startIndex, filteredRows*/ 6) {
    			 $$invalidate(96, endIndex = Math.min(startIndex + Math.ceil($visibleHeight / rowHeight), filteredRows.length - 1));
    		}

    		if ($$self.$$.dirty[1] & /*rowHeight*/ 8388608 | $$self.$$.dirty[3] & /*startIndex*/ 4) {
    			 $$invalidate(17, paddingTop = startIndex * rowHeight);
    		}

    		if ($$self.$$.dirty[1] & /*rowHeight*/ 8388608 | $$self.$$.dirty[3] & /*filteredRows, endIndex*/ 10) {
    			 $$invalidate(18, paddingBottom = (filteredRows.length - endIndex - 1) * rowHeight);
    		}

    		if ($$self.$$.dirty[3] & /*filteredRows, startIndex, endIndex*/ 14) {
    			 $$invalidate(19, visibleRows = filteredRows.slice(startIndex, endIndex + 1));
    		}

    		if ($$self.$$.dirty[0] & /*visibleRows*/ 524288 | $$self.$$.dirty[3] & /*$rowTaskCache, $taskStore*/ 266240) {
    			 {
    				const tasks = [];

    				visibleRows.forEach(row => {
    					if ($rowTaskCache[row.model.id]) {
    						$rowTaskCache[row.model.id].forEach(id => {
    							tasks.push($taskStore.entities[id]);
    						});
    					}
    				});

    				$$invalidate(20, visibleTasks = tasks);
    			}
    		}

    		if ($$self.$$.dirty[3] & /*$dimensionsChanged*/ 2048) {
    			 if ($dimensionsChanged) tickWithoutCSSTransition();
    		}
    	};

    	return [
    		headers,
    		tableWidth,
    		columnUnit,
    		columnOffset,
    		classes,
    		ganttTableModules,
    		ganttBodyModules,
    		columnStrokeColor,
    		columnStrokeWidth,
    		ganttElement,
    		mainHeaderContainer,
    		mainContainer,
    		rowContainer,
    		columns,
    		zooming,
    		rightScrollbarVisible,
    		rowContainerHeight,
    		paddingTop,
    		paddingBottom,
    		visibleRows,
    		visibleTasks,
    		disableTransition,
    		$_width,
    		$visibleHeight,
    		$headerHeight,
    		$allTimeRanges,
    		$visibleWidth,
    		_rowHeight,
    		_rowPadding,
    		_from,
    		_to,
    		_minWidth,
    		_fitWidth,
    		visibleWidth,
    		visibleHeight,
    		headerHeight,
    		_width,
    		columnWidth,
    		dimensionsChanged,
    		hoveredRow,
    		selectedRow,
    		scrollable,
    		horizontalScrollListener,
    		onResize,
    		onwheel,
    		onDateSelected,
    		$$restProps,
    		taskFactory,
    		rowFactory,
    		utils,
    		rows,
    		tasks,
    		timeRanges,
    		rowPadding,
    		rowHeight,
    		from,
    		to,
    		minWidth,
    		fitWidth,
    		zoomLevels,
    		taskContent,
    		resizeHandleWidth,
    		onTaskButtonClick,
    		dateAdapter,
    		magnetUnit,
    		magnetOffset,
    		reflectOnParentRows,
    		reflectOnChildRows,
    		taskElementHook,
    		columnService,
    		api,
    		dndManager,
    		timeRangeFactory,
    		refreshTimeRanges,
    		refreshTasks,
    		getRowContainer,
    		selectTask,
    		unselectTasks,
    		scrollToRow,
    		scrollToTask,
    		updateTask,
    		updateTasks,
    		updateRow,
    		updateRows,
    		getRow,
    		getTask,
    		getTasks,
    		mounted,
    		magnetDuration,
    		columnDuration,
    		columnCount,
    		__scrollTop,
    		__scrollLeft,
    		zoomLevel,
    		filteredRows,
    		startIndex,
    		endIndex,
    		$_rowHeight,
    		$_rowPadding,
    		$_from,
    		$_to,
    		$_minWidth,
    		$_fitWidth,
    		$columnWidth,
    		$dimensionsChanged,
    		$taskStore,
    		$hoveredRow,
    		$selectedRow,
    		$rowStore,
    		$allTasks,
    		$allRows,
    		$rowTaskCache,
    		__awaiter,
    		scrollables,
    		setMagnetDuration,
    		setColumnDuration,
    		getColumns,
    		ganttContext,
    		initRows,
    		initTasks,
    		initTimeRanges,
    		tickWithoutCSSTransition,
    		selectionManager,
    		div2_binding,
    		div2_elementresize_handler,
    		div4_binding,
    		div7_binding,
    		div7_elementresize_handler,
    		div9_binding
    	];
    }

    class Gantt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$9,
    			create_fragment$9,
    			safe_not_equal,
    			{
    				rows: 50,
    				tasks: 51,
    				timeRanges: 52,
    				rowPadding: 53,
    				rowHeight: 54,
    				from: 55,
    				to: 56,
    				minWidth: 57,
    				fitWidth: 58,
    				classes: 4,
    				headers: 0,
    				zoomLevels: 59,
    				taskContent: 60,
    				tableWidth: 1,
    				resizeHandleWidth: 61,
    				onTaskButtonClick: 62,
    				dateAdapter: 63,
    				magnetUnit: 64,
    				magnetOffset: 65,
    				columnUnit: 2,
    				columnOffset: 3,
    				ganttTableModules: 5,
    				ganttBodyModules: 6,
    				reflectOnParentRows: 66,
    				reflectOnChildRows: 67,
    				columnStrokeColor: 7,
    				columnStrokeWidth: 8,
    				taskElementHook: 68,
    				columnService: 69,
    				api: 70,
    				taskFactory: 47,
    				rowFactory: 48,
    				dndManager: 71,
    				timeRangeFactory: 72,
    				utils: 49,
    				refreshTimeRanges: 73,
    				refreshTasks: 74,
    				getRowContainer: 75,
    				selectTask: 76,
    				unselectTasks: 77,
    				scrollToRow: 78,
    				scrollToTask: 79,
    				updateTask: 80,
    				updateTasks: 81,
    				updateRow: 82,
    				updateRows: 83,
    				getRow: 84,
    				getTask: 85,
    				getTasks: 86
    			},
    			[-1, -1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gantt",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*rows*/ ctx[50] === undefined && !("rows" in props)) {
    			console_1$2$1.warn("<Gantt> was created without expected prop 'rows'");
    		}

    		if (/*from*/ ctx[55] === undefined && !("from" in props)) {
    			console_1$2$1.warn("<Gantt> was created without expected prop 'from'");
    		}

    		if (/*to*/ ctx[56] === undefined && !("to" in props)) {
    			console_1$2$1.warn("<Gantt> was created without expected prop 'to'");
    		}

    		if (/*columnStrokeColor*/ ctx[7] === undefined && !("columnStrokeColor" in props)) {
    			console_1$2$1.warn("<Gantt> was created without expected prop 'columnStrokeColor'");
    		}

    		if (/*columnStrokeWidth*/ ctx[8] === undefined && !("columnStrokeWidth" in props)) {
    			console_1$2$1.warn("<Gantt> was created without expected prop 'columnStrokeWidth'");
    		}
    	}

    	get rows() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tasks() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tasks(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get timeRanges() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timeRanges(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rowPadding() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rowPadding(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rowHeight() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rowHeight(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get from() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set from(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get to() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minWidth() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minWidth(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fitWidth() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fitWidth(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classes() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classes(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get headers() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headers(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zoomLevels() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zoomLevels(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get taskContent() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set taskContent(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tableWidth() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tableWidth(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resizeHandleWidth() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set resizeHandleWidth(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTaskButtonClick() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTaskButtonClick(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dateAdapter() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dateAdapter(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get magnetUnit() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set magnetUnit(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get magnetOffset() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set magnetOffset(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columnUnit() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columnUnit(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columnOffset() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columnOffset(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ganttTableModules() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ganttTableModules(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ganttBodyModules() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ganttBodyModules(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get reflectOnParentRows() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reflectOnParentRows(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get reflectOnChildRows() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reflectOnChildRows(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columnStrokeColor() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columnStrokeColor(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columnStrokeWidth() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columnStrokeWidth(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get taskElementHook() {
    		throw new Error_1("<Gantt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set taskElementHook(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columnService() {
    		return this.$$.ctx[69];
    	}

    	set columnService(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get api() {
    		return this.$$.ctx[70];
    	}

    	set api(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get taskFactory() {
    		return this.$$.ctx[47];
    	}

    	set taskFactory(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rowFactory() {
    		return this.$$.ctx[48];
    	}

    	set rowFactory(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dndManager() {
    		return this.$$.ctx[71];
    	}

    	set dndManager(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get timeRangeFactory() {
    		return this.$$.ctx[72];
    	}

    	set timeRangeFactory(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get utils() {
    		return this.$$.ctx[49];
    	}

    	set utils(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get refreshTimeRanges() {
    		return this.$$.ctx[73];
    	}

    	set refreshTimeRanges(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get refreshTasks() {
    		return this.$$.ctx[74];
    	}

    	set refreshTasks(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getRowContainer() {
    		return this.$$.ctx[75];
    	}

    	set getRowContainer(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectTask() {
    		return this.$$.ctx[76];
    	}

    	set selectTask(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unselectTasks() {
    		return this.$$.ctx[77];
    	}

    	set unselectTasks(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollToRow() {
    		return this.$$.ctx[78];
    	}

    	set scrollToRow(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scrollToTask() {
    		return this.$$.ctx[79];
    	}

    	set scrollToTask(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateTask() {
    		return this.$$.ctx[80];
    	}

    	set updateTask(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateTasks() {
    		return this.$$.ctx[81];
    	}

    	set updateTasks(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateRow() {
    		return this.$$.ctx[82];
    	}

    	set updateRow(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateRows() {
    		return this.$$.ctx[83];
    	}

    	set updateRows(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getRow() {
    		return this.$$.ctx[84];
    	}

    	set getRow(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getTask() {
    		return this.$$.ctx[85];
    	}

    	set getTask(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getTasks() {
    		return this.$$.ctx[86];
    	}

    	set getTasks(value) {
    		throw new Error_1("<Gantt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$b = ".sg-tree-expander.svelte-1tpezbv{cursor:pointer;min-width:1.4em;display:flex;justify-content:center;align-items:center}.sg-cell-inner.svelte-1tpezbv{display:flex}";
    styleInject(css_248z$b);

    /* src\modules\table\TableTreeCell.svelte generated by Svelte v3.23.0 */
    const file$9 = "src\\modules\\table\\TableTreeCell.svelte";

    // (16:4) {#if row.children}
    function create_if_block$2$1(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*row*/ ctx[0].expanded) return create_if_block_1$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "sg-tree-expander svelte-1tpezbv");
    			add_location(div, file$9, 16, 8, 477);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*onExpandToggle*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2$1.name,
    		type: "if",
    		source: "(16:4) {#if row.children}",
    		ctx
    	});

    	return block;
    }

    // (20:12) {:else}
    function create_else_block$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-angle-right");
    			add_location(i, file$9, 20, 12, 649);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(20:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (18:12) {#if row.expanded}
    function create_if_block_1$1(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			attr_dev(i, "class", "fas fa-angle-down");
    			add_location(i, file$9, 18, 12, 581);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(18:12) {#if row.expanded}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let t;
    	let current;
    	let if_block = /*row*/ ctx[0].children && create_if_block$2$1(ctx);
    	const default_slot_template = /*$$slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "sg-cell-inner svelte-1tpezbv");
    			set_style(div, "padding-left", /*row*/ ctx[0].childLevel * 3 + "em");
    			add_location(div, file$9, 14, 0, 373);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*row*/ ctx[0].children) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2$1(ctx);
    					if_block.c();
    					if_block.m(div, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*row*/ 1) {
    				set_style(div, "padding-left", /*row*/ ctx[0].childLevel * 3 + "em");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	
    	let { row } = $$props;
    	const dispatch = createEventDispatcher();

    	function onExpandToggle() {
    		if (row.expanded) {
    			dispatch("rowCollapsed", { row });
    		} else {
    			dispatch("rowExpanded", { row });
    		}
    	}

    	const writable_props = ["row"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TableTreeCell> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TableTreeCell", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("row" in $$props) $$invalidate(0, row = $$props.row);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		getContext,
    		row,
    		dispatch,
    		onExpandToggle
    	});

    	$$self.$inject_state = $$props => {
    		if ("row" in $$props) $$invalidate(0, row = $$props.row);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [row, onExpandToggle, dispatch, $$scope, $$slots];
    }

    class TableTreeCell extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { row: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableTreeCell",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*row*/ ctx[0] === undefined && !("row" in props)) {
    			console.warn("<TableTreeCell> was created without expected prop 'row'");
    		}
    	}

    	get row() {
    		throw new Error("<TableTreeCell>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<TableTreeCell>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$c = ".sg-table-row.svelte-1d4m2ui{display:inline-flex;min-width:100%;align-items:stretch;position:relative;font-weight:400;font-size:14px}.sg-table-cell.svelte-1d4m2ui{border-left:1px solid #eee}.sg-table-body-cell.svelte-1d4m2ui{border-bottom:#efefef 1px solid;background-color:#fff;font-weight:bold}.sg-resource-image.svelte-1d4m2ui{width:2.4em;height:2.4em;border-radius:50%;margin-right:.6em;background:#047c69}.sg-resource-info.svelte-1d4m2ui{flex:1;height:100%;display:flex;flex-direction:row;align-items:center}.sg-table-icon.svelte-1d4m2ui{margin-right:0.5em}";
    styleInject(css_248z$c);

    /* src\modules\table\TableRow.svelte generated by Svelte v3.23.0 */
    const file$a = "src\\modules\\table\\TableRow.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (40:12) {:else}
    function create_else_block_1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = /*row*/ ctx[1].model.iconClass && create_if_block_7(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*row*/ ctx[1].model.headerHtml) return create_if_block_4$1;
    		if (/*header*/ ctx[12].renderer) return create_if_block_5;
    		if (/*header*/ ctx[12].type === "resourceInfo") return create_if_block_6;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*row*/ ctx[1].model.iconClass) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(40:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (24:12) {#if header.type == 'tree'}
    function create_if_block$3(ctx) {
    	let current;

    	const tabletreecell = new TableTreeCell({
    			props: {
    				row: /*row*/ ctx[1],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tabletreecell.$on("rowCollapsed", /*rowCollapsed_handler*/ ctx[10]);
    	tabletreecell.$on("rowExpanded", /*rowExpanded_handler*/ ctx[11]);

    	const block = {
    		c: function create() {
    			create_component(tabletreecell.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabletreecell, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tabletreecell_changes = {};
    			if (dirty & /*row*/ 2) tabletreecell_changes.row = /*row*/ ctx[1];

    			if (dirty & /*$$scope, row, headers*/ 32771) {
    				tabletreecell_changes.$$scope = { dirty, ctx };
    			}

    			tabletreecell.$set(tabletreecell_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabletreecell.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabletreecell.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabletreecell, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(24:12) {#if header.type == 'tree'}",
    		ctx
    	});

    	return block;
    }

    // (41:16) {#if row.model.iconClass}
    function create_if_block_7(ctx) {
    	let div;
    	let i;
    	let i_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*row*/ ctx[1].model.iconClass) + " svelte-1d4m2ui"));
    			add_location(i, file$a, 42, 20, 1718);
    			attr_dev(div, "class", "sg-table-icon svelte-1d4m2ui");
    			add_location(div, file$a, 41, 16, 1669);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*row*/ 2 && i_class_value !== (i_class_value = "" + (null_to_empty(/*row*/ ctx[1].model.iconClass) + " svelte-1d4m2ui"))) {
    				attr_dev(i, "class", i_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(41:16) {#if row.model.iconClass}",
    		ctx
    	});

    	return block;
    }

    // (56:16) {:else}
    function create_else_block_2(ctx) {
    	let t_value = /*row*/ ctx[1].model[/*header*/ ctx[12].property] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*row, headers*/ 3 && t_value !== (t_value = /*row*/ ctx[1].model[/*header*/ ctx[12].property] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(56:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (51:57) 
    function create_if_block_6(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let div;
    	let t1_value = /*row*/ ctx[1].model[/*header*/ ctx[12].property] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			div = element("div");
    			t1 = text(t1_value);
    			attr_dev(img, "class", "sg-resource-image svelte-1d4m2ui");
    			if (img.src !== (img_src_value = /*row*/ ctx[1].model.imageSrc)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$a, 51, 20, 2073);
    			attr_dev(div, "class", "sg-resource-title");
    			add_location(div, file$a, 52, 20, 2161);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*row*/ 2 && img.src !== (img_src_value = /*row*/ ctx[1].model.imageSrc)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*row, headers*/ 3 && t1_value !== (t1_value = /*row*/ ctx[1].model[/*header*/ ctx[12].property] + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(51:57) ",
    		ctx
    	});

    	return block;
    }

    // (49:42) 
    function create_if_block_5(ctx) {
    	let html_tag;
    	let raw_value = /*header*/ ctx[12].renderer(/*row*/ ctx[1]) + "";

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(null);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*headers, row*/ 3 && raw_value !== (raw_value = /*header*/ ctx[12].renderer(/*row*/ ctx[1]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(49:42) ",
    		ctx
    	});

    	return block;
    }

    // (47:16) {#if row.model.headerHtml}
    function create_if_block_4$1(ctx) {
    	let html_tag;
    	let raw_value = /*row*/ ctx[1].model.headerHtml + "";

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(null);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*row*/ 2 && raw_value !== (raw_value = /*row*/ ctx[1].model.headerHtml + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(47:16) {#if row.model.headerHtml}",
    		ctx
    	});

    	return block;
    }

    // (26:20) {#if row.model.iconClass}
    function create_if_block_3$1(ctx) {
    	let div;
    	let i;
    	let i_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*row*/ ctx[1].model.iconClass) + " svelte-1d4m2ui"));
    			add_location(i, file$a, 27, 24, 1145);
    			attr_dev(div, "class", "sg-table-icon svelte-1d4m2ui");
    			add_location(div, file$a, 26, 20, 1092);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*row*/ 2 && i_class_value !== (i_class_value = "" + (null_to_empty(/*row*/ ctx[1].model.iconClass) + " svelte-1d4m2ui"))) {
    				attr_dev(i, "class", i_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(26:20) {#if row.model.iconClass}",
    		ctx
    	});

    	return block;
    }

    // (36:20) {:else}
    function create_else_block$2(ctx) {
    	let t_value = /*row*/ ctx[1].model[/*header*/ ctx[12].property] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*row, headers*/ 3 && t_value !== (t_value = /*row*/ ctx[1].model[/*header*/ ctx[12].property] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(36:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (34:46) 
    function create_if_block_2$1(ctx) {
    	let html_tag;
    	let raw_value = /*header*/ ctx[12].renderer(/*row*/ ctx[1]) + "";

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(null);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*headers, row*/ 3 && raw_value !== (raw_value = /*header*/ ctx[12].renderer(/*row*/ ctx[1]) + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(34:46) ",
    		ctx
    	});

    	return block;
    }

    // (32:20) {#if row.model.headerHtml}
    function create_if_block_1$2(ctx) {
    	let html_tag;
    	let raw_value = /*row*/ ctx[1].model.headerHtml + "";

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag(null);
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*row*/ 2 && raw_value !== (raw_value = /*row*/ ctx[1].model.headerHtml + "")) html_tag.p(raw_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(32:20) {#if row.model.headerHtml}",
    		ctx
    	});

    	return block;
    }

    // (25:16) <TableTreeCell on:rowCollapsed on:rowExpanded {row}>
    function create_default_slot$1(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = /*row*/ ctx[1].model.iconClass && create_if_block_3$1(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*row*/ ctx[1].model.headerHtml) return create_if_block_1$2;
    		if (/*header*/ ctx[12].renderer) return create_if_block_2$1;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*row*/ ctx[1].model.iconClass) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(25:16) <TableTreeCell on:rowCollapsed on:rowExpanded {row}>",
    		ctx
    	});

    	return block;
    }

    // (22:4) {#each headers as header}
    function create_each_block$3(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*header*/ ctx[12].type == "tree") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t = space();
    			attr_dev(div, "class", "sg-table-body-cell sg-table-cell svelte-1d4m2ui");
    			set_style(div, "width", /*header*/ ctx[12].width + "px");
    			add_location(div, file$a, 22, 8, 835);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, t);
    			}

    			if (!current || dirty & /*headers*/ 1) {
    				set_style(div, "width", /*header*/ ctx[12].width + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(22:4) {#each headers as header}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let div_data_row_id_value;
    	let div_class_value;
    	let current;
    	let each_value = /*headers*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "data-row-id", div_data_row_id_value = /*row*/ ctx[1].model.id);
    			set_style(div, "height", /*$rowHeight*/ ctx[2] + "px");
    			attr_dev(div, "class", div_class_value = "sg-table-row " + (/*row*/ ctx[1].model.classes || "") + " svelte-1d4m2ui");
    			toggle_class(div, "sg-row-expanded", /*row*/ ctx[1].expanded);
    			toggle_class(div, "sg-hover", /*$hoveredRow*/ ctx[3] == /*row*/ ctx[1].model.id);
    			toggle_class(div, "sg-selected", /*$selectedRow*/ ctx[4] == /*row*/ ctx[1].model.id);
    			add_location(div, file$a, 15, 0, 522);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*headers, row*/ 3) {
    				each_value = /*headers*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*row*/ 2 && div_data_row_id_value !== (div_data_row_id_value = /*row*/ ctx[1].model.id)) {
    				attr_dev(div, "data-row-id", div_data_row_id_value);
    			}

    			if (!current || dirty & /*$rowHeight*/ 4) {
    				set_style(div, "height", /*$rowHeight*/ ctx[2] + "px");
    			}

    			if (!current || dirty & /*row*/ 2 && div_class_value !== (div_class_value = "sg-table-row " + (/*row*/ ctx[1].model.classes || "") + " svelte-1d4m2ui")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*row, row*/ 2) {
    				toggle_class(div, "sg-row-expanded", /*row*/ ctx[1].expanded);
    			}

    			if (dirty & /*row, $hoveredRow, row*/ 10) {
    				toggle_class(div, "sg-hover", /*$hoveredRow*/ ctx[3] == /*row*/ ctx[1].model.id);
    			}

    			if (dirty & /*row, $selectedRow, row*/ 18) {
    				toggle_class(div, "sg-selected", /*$selectedRow*/ ctx[4] == /*row*/ ctx[1].model.id);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $rowHeight;
    	let $hoveredRow;
    	let $selectedRow;
    	
    	
    	let { headers = null } = $$props;
    	let { row = null } = $$props;
    	const { rowHeight } = getContext("options");
    	validate_store(rowHeight, "rowHeight");
    	component_subscribe($$self, rowHeight, value => $$invalidate(2, $rowHeight = value));
    	const { hoveredRow, selectedRow } = getContext("gantt");
    	validate_store(hoveredRow, "hoveredRow");
    	component_subscribe($$self, hoveredRow, value => $$invalidate(3, $hoveredRow = value));
    	validate_store(selectedRow, "selectedRow");
    	component_subscribe($$self, selectedRow, value => $$invalidate(4, $selectedRow = value));
    	const dispatch = createEventDispatcher();
    	let treeIndentationStyle = "";
    	const writable_props = ["headers", "row"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TableRow> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("TableRow", $$slots, []);

    	function rowCollapsed_handler(event) {
    		bubble($$self, event);
    	}

    	function rowExpanded_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("headers" in $$props) $$invalidate(0, headers = $$props.headers);
    		if ("row" in $$props) $$invalidate(1, row = $$props.row);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		getContext,
    		TableTreeCell,
    		headers,
    		row,
    		rowHeight,
    		hoveredRow,
    		selectedRow,
    		dispatch,
    		treeIndentationStyle,
    		$rowHeight,
    		$hoveredRow,
    		$selectedRow
    	});

    	$$self.$inject_state = $$props => {
    		if ("headers" in $$props) $$invalidate(0, headers = $$props.headers);
    		if ("row" in $$props) $$invalidate(1, row = $$props.row);
    		if ("treeIndentationStyle" in $$props) treeIndentationStyle = $$props.treeIndentationStyle;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*row*/ 2) {
    			 {
    				treeIndentationStyle = row.parent
    				? `padding-left: ${row.childLevel * 3}em;`
    				: "";
    			}
    		}
    	};

    	return [
    		headers,
    		row,
    		$rowHeight,
    		$hoveredRow,
    		$selectedRow,
    		rowHeight,
    		hoveredRow,
    		selectedRow,
    		treeIndentationStyle,
    		dispatch,
    		rowCollapsed_handler,
    		rowExpanded_handler
    	];
    }

    class TableRow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { headers: 0, row: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableRow",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get headers() {
    		throw new Error("<TableRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headers(value) {
    		throw new Error("<TableRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get row() {
    		throw new Error("<TableRow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set row(value) {
    		throw new Error("<TableRow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$d = ".bottom-scrollbar-visible.svelte-iysj96{padding-bottom:17px}.sg-table.svelte-iysj96{overflow-x:auto;display:flex;flex-direction:column}.sg-table-scroller.svelte-iysj96{width:100%;border-bottom:1px solid #efefef;overflow-y:hidden}.sg-table-header.svelte-iysj96{display:flex;align-items:stretch;overflow:hidden;border-bottom:#efefef 1px solid;background-color:#fbfbfb}.sg-table-rows.svelte-iysj96{}.sg-table-body.svelte-iysj96{display:flex;flex:1 1 0;width:100%;overflow-y:hidden}.sg-table-header-cell.svelte-iysj96{font-size:14px;font-weight:400}.sg-table-cell{white-space:nowrap;overflow:hidden;display:flex;align-items:center;flex-shrink:0;padding:0 .5em;height:100%}.sg-table-cell:last-child{flex-grow:1}";
    styleInject(css_248z$d);

    /* src\modules\table\Table.svelte generated by Svelte v3.23.0 */
    const file$b = "src\\modules\\table\\Table.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    // (99:8) {#each tableHeaders as header}
    function create_each_block_1$1$1(ctx) {
    	let div;
    	let t0_value = /*header*/ ctx[33].title + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "sg-table-header-cell sg-table-cell svelte-iysj96");
    			set_style(div, "width", /*header*/ ctx[33].width + "px");
    			add_location(div, file$b, 99, 12, 3049);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*tableHeaders*/ 32 && t0_value !== (t0_value = /*header*/ ctx[33].title + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*tableHeaders*/ 32) {
    				set_style(div, "width", /*header*/ ctx[33].width + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1$1.name,
    		type: "each",
    		source: "(99:8) {#each tableHeaders as header}",
    		ctx
    	});

    	return block;
    }

    // (109:16) {#each visibleRows as row}
    function create_each_block$4(ctx) {
    	let current;

    	const tablerow = new TableRow({
    			props: {
    				row: /*row*/ ctx[30],
    				headers: /*tableHeaders*/ ctx[5]
    			},
    			$$inline: true
    		});

    	tablerow.$on("rowExpanded", /*onRowExpanded*/ ctx[15]);
    	tablerow.$on("rowCollapsed", /*onRowCollapsed*/ ctx[16]);

    	const block = {
    		c: function create() {
    			create_component(tablerow.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tablerow, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tablerow_changes = {};
    			if (dirty[0] & /*visibleRows*/ 16) tablerow_changes.row = /*row*/ ctx[30];
    			if (dirty[0] & /*tableHeaders*/ 32) tablerow_changes.headers = /*tableHeaders*/ ctx[5];
    			tablerow.$set(tablerow_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tablerow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tablerow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tablerow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(109:16) {#each visibleRows as row}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div4;
    	let div0;
    	let t;
    	let div3;
    	let div2;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*tableHeaders*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1$1(get_each_context_1$1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*visibleRows*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "sg-table-header svelte-iysj96");
    			set_style(div0, "height", /*$headerHeight*/ ctx[8] + "px");
    			add_location(div0, file$b, 97, 4, 2905);
    			attr_dev(div1, "class", "sg-table-rows svelte-iysj96");
    			set_style(div1, "padding-top", /*paddingTop*/ ctx[1] + "px");
    			set_style(div1, "padding-bottom", /*paddingBottom*/ ctx[2] + "px");
    			set_style(div1, "height", /*rowContainerHeight*/ ctx[3] + "px");
    			add_location(div1, file$b, 107, 12, 3376);
    			attr_dev(div2, "class", "sg-table-scroller svelte-iysj96");
    			add_location(div2, file$b, 106, 8, 3312);
    			attr_dev(div3, "class", "sg-table-body svelte-iysj96");
    			toggle_class(div3, "bottom-scrollbar-visible", /*bottomScrollbarVisible*/ ctx[7]);
    			add_location(div3, file$b, 105, 4, 3217);
    			attr_dev(div4, "class", "sg-table sg-view svelte-iysj96");
    			set_style(div4, "width", /*tableWidth*/ ctx[0] + "px");
    			add_location(div4, file$b, 96, 0, 2839);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			/*div0_binding*/ ctx[29](div0);
    			append_dev(div4, t);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(ctx[14].call(null, div2));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*tableHeaders*/ 32) {
    				each_value_1 = /*tableHeaders*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (!current || dirty[0] & /*$headerHeight*/ 256) {
    				set_style(div0, "height", /*$headerHeight*/ ctx[8] + "px");
    			}

    			if (dirty[0] & /*visibleRows, tableHeaders, onRowExpanded, onRowCollapsed*/ 98352) {
    				each_value = /*visibleRows*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*paddingTop*/ 2) {
    				set_style(div1, "padding-top", /*paddingTop*/ ctx[1] + "px");
    			}

    			if (!current || dirty[0] & /*paddingBottom*/ 4) {
    				set_style(div1, "padding-bottom", /*paddingBottom*/ ctx[2] + "px");
    			}

    			if (!current || dirty[0] & /*rowContainerHeight*/ 8) {
    				set_style(div1, "height", /*rowContainerHeight*/ ctx[3] + "px");
    			}

    			if (dirty[0] & /*bottomScrollbarVisible*/ 128) {
    				toggle_class(div3, "bottom-scrollbar-visible", /*bottomScrollbarVisible*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*tableWidth*/ 1) {
    				set_style(div4, "width", /*tableWidth*/ ctx[0] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks_1, detaching);
    			/*div0_binding*/ ctx[29](null);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const type = "table";

    function hide(children) {
    	children.forEach(row => {
    		if (row.children) hide(row.children);
    		row.hidden = true;
    	});
    }

    function show(children, hidden = false) {
    	children.forEach(row => {
    		if (row.children) show(row.children, !row.expanded);
    		row.hidden = hidden;
    	});
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $rowStore;
    	let $rowHeight;
    	let $taskStore;
    	let $rowPadding;
    	let $width;
    	let $visibleWidth;
    	let $headerHeight;
    	validate_store(rowStore, "rowStore");
    	component_subscribe($$self, rowStore, $$value => $$invalidate(18, $rowStore = $$value));
    	validate_store(taskStore, "taskStore");
    	component_subscribe($$self, taskStore, $$value => $$invalidate(20, $taskStore = $$value));
    	const dispatch = createEventDispatcher();
    	
    	
    	let { tableWidth } = $$props;
    	let { paddingTop } = $$props;
    	let { paddingBottom } = $$props;
    	let { rowContainerHeight } = $$props;
    	let { visibleRows } = $$props;

    	let { tableHeaders = [
    		{
    			title: "Name",
    			property: "label",
    			width: 100
    		}
    	] } = $$props;

    	const { from, to, width, visibleWidth, headerHeight } = getContext("dimensions");
    	validate_store(width, "width");
    	component_subscribe($$self, width, value => $$invalidate(22, $width = value));
    	validate_store(visibleWidth, "visibleWidth");
    	component_subscribe($$self, visibleWidth, value => $$invalidate(23, $visibleWidth = value));
    	validate_store(headerHeight, "headerHeight");
    	component_subscribe($$self, headerHeight, value => $$invalidate(8, $headerHeight = value));
    	const { rowPadding, rowHeight } = getContext("options");
    	validate_store(rowPadding, "rowPadding");
    	component_subscribe($$self, rowPadding, value => $$invalidate(21, $rowPadding = value));
    	validate_store(rowHeight, "rowHeight");
    	component_subscribe($$self, rowHeight, value => $$invalidate(19, $rowHeight = value));

    	onMount(() => {
    		dispatch("init", { module: this });
    	});

    	const { scrollables } = getContext("gantt");
    	let headerContainer;

    	function scrollListener(node) {
    		scrollables.push({ node, orientation: "vertical" });

    		node.addEventListener("scroll", event => {
    			$$invalidate(6, headerContainer.scrollLeft = node.scrollLeft, headerContainer);
    		});

    		return {
    			destroy() {
    				node.removeEventListener("scroll");
    			}
    		};
    	}

    	let scrollWidth;

    	function onRowExpanded(event) {
    		const row = event.detail.row;
    		row.expanded = true;
    		if (row.children) show(row.children);
    		updateYPositions();
    	}

    	function onRowCollapsed(event) {
    		const row = event.detail.row;
    		row.expanded = false;
    		if (row.children) hide(row.children);
    		updateYPositions();
    	}

    	function updateYPositions() {
    		let y = 0;

    		$rowStore.ids.forEach(id => {
    			const row = $rowStore.entities[id];

    			if (!row.hidden) {
    				set_store_value(rowStore, $rowStore.entities[id].y = y, $rowStore);
    				y += $rowHeight;
    			}
    		});

    		$taskStore.ids.forEach(id => {
    			const task = $taskStore.entities[id];
    			const row = $rowStore.entities[task.model.resourceId];
    			set_store_value(taskStore, $taskStore.entities[id].top = row.y + $rowPadding, $taskStore);
    		});
    	}

    	// if gantt displays a bottom scrollbar and table does not, we need to pad out the table
    	let bottomScrollbarVisible;

    	const writable_props = [
    		"tableWidth",
    		"paddingTop",
    		"paddingBottom",
    		"rowContainerHeight",
    		"visibleRows",
    		"tableHeaders"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Table", $$slots, []);

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(6, headerContainer = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("tableWidth" in $$props) $$invalidate(0, tableWidth = $$props.tableWidth);
    		if ("paddingTop" in $$props) $$invalidate(1, paddingTop = $$props.paddingTop);
    		if ("paddingBottom" in $$props) $$invalidate(2, paddingBottom = $$props.paddingBottom);
    		if ("rowContainerHeight" in $$props) $$invalidate(3, rowContainerHeight = $$props.rowContainerHeight);
    		if ("visibleRows" in $$props) $$invalidate(4, visibleRows = $$props.visibleRows);
    		if ("tableHeaders" in $$props) $$invalidate(5, tableHeaders = $$props.tableHeaders);
    	};

    	$$self.$capture_state = () => ({
    		type,
    		createEventDispatcher,
    		onMount,
    		getContext,
    		dispatch,
    		TableRow,
    		rowStore,
    		taskStore,
    		tableWidth,
    		paddingTop,
    		paddingBottom,
    		rowContainerHeight,
    		visibleRows,
    		tableHeaders,
    		from,
    		to,
    		width,
    		visibleWidth,
    		headerHeight,
    		rowPadding,
    		rowHeight,
    		scrollables,
    		headerContainer,
    		scrollListener,
    		scrollWidth,
    		onRowExpanded,
    		onRowCollapsed,
    		updateYPositions,
    		hide,
    		show,
    		bottomScrollbarVisible,
    		$rowStore,
    		$rowHeight,
    		$taskStore,
    		$rowPadding,
    		$width,
    		$visibleWidth,
    		$headerHeight
    	});

    	$$self.$inject_state = $$props => {
    		if ("tableWidth" in $$props) $$invalidate(0, tableWidth = $$props.tableWidth);
    		if ("paddingTop" in $$props) $$invalidate(1, paddingTop = $$props.paddingTop);
    		if ("paddingBottom" in $$props) $$invalidate(2, paddingBottom = $$props.paddingBottom);
    		if ("rowContainerHeight" in $$props) $$invalidate(3, rowContainerHeight = $$props.rowContainerHeight);
    		if ("visibleRows" in $$props) $$invalidate(4, visibleRows = $$props.visibleRows);
    		if ("tableHeaders" in $$props) $$invalidate(5, tableHeaders = $$props.tableHeaders);
    		if ("headerContainer" in $$props) $$invalidate(6, headerContainer = $$props.headerContainer);
    		if ("scrollWidth" in $$props) $$invalidate(17, scrollWidth = $$props.scrollWidth);
    		if ("bottomScrollbarVisible" in $$props) $$invalidate(7, bottomScrollbarVisible = $$props.bottomScrollbarVisible);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*tableHeaders*/ 32) {
    			 {
    				let sum = 0;

    				tableHeaders.forEach(header => {
    					sum += header.width;
    				});

    				$$invalidate(17, scrollWidth = sum);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$width, $visibleWidth, scrollWidth, tableWidth*/ 12713985) {
    			 {
    				$$invalidate(7, bottomScrollbarVisible = $width > $visibleWidth && scrollWidth <= tableWidth);
    			}
    		}
    	};

    	return [
    		tableWidth,
    		paddingTop,
    		paddingBottom,
    		rowContainerHeight,
    		visibleRows,
    		tableHeaders,
    		headerContainer,
    		bottomScrollbarVisible,
    		$headerHeight,
    		width,
    		visibleWidth,
    		headerHeight,
    		rowPadding,
    		rowHeight,
    		scrollListener,
    		onRowExpanded,
    		onRowCollapsed,
    		scrollWidth,
    		$rowStore,
    		$rowHeight,
    		$taskStore,
    		$rowPadding,
    		$width,
    		$visibleWidth,
    		dispatch,
    		from,
    		to,
    		scrollables,
    		updateYPositions,
    		div0_binding
    	];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$c,
    			create_fragment$c,
    			safe_not_equal,
    			{
    				tableWidth: 0,
    				paddingTop: 1,
    				paddingBottom: 2,
    				rowContainerHeight: 3,
    				visibleRows: 4,
    				tableHeaders: 5
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*tableWidth*/ ctx[0] === undefined && !("tableWidth" in props)) {
    			console.warn("<Table> was created without expected prop 'tableWidth'");
    		}

    		if (/*paddingTop*/ ctx[1] === undefined && !("paddingTop" in props)) {
    			console.warn("<Table> was created without expected prop 'paddingTop'");
    		}

    		if (/*paddingBottom*/ ctx[2] === undefined && !("paddingBottom" in props)) {
    			console.warn("<Table> was created without expected prop 'paddingBottom'");
    		}

    		if (/*rowContainerHeight*/ ctx[3] === undefined && !("rowContainerHeight" in props)) {
    			console.warn("<Table> was created without expected prop 'rowContainerHeight'");
    		}

    		if (/*visibleRows*/ ctx[4] === undefined && !("visibleRows" in props)) {
    			console.warn("<Table> was created without expected prop 'visibleRows'");
    		}
    	}

    	get tableWidth() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tableWidth(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paddingTop() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paddingTop(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paddingBottom() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paddingBottom(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rowContainerHeight() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rowContainerHeight(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visibleRows() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visibleRows(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tableHeaders() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tableHeaders(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SvelteGanttTable = Table;

    var css_248z$e = ".arrow.svelte-5u2c1l{position:absolute;left:0px;pointer-events:none}.select-area.svelte-5u2c1l{pointer-events:visible;position:absolute}";
    styleInject(css_248z$e);

    /* src\modules\dependencies\Arrow.svelte generated by Svelte v3.23.0 */
    const file$c = "src\\modules\\dependencies\\Arrow.svelte";

    function create_fragment$d(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", /*path*/ ctx[2]);
    			attr_dev(path0, "stroke", /*stroke*/ ctx[0]);
    			attr_dev(path0, "stroke-width", /*strokeWidth*/ ctx[1]);
    			attr_dev(path0, "fill", "transparent");
    			attr_dev(path0, "class", "select-area svelte-5u2c1l");
    			add_location(path0, file$c, 42, 4, 1399);
    			attr_dev(path1, "d", /*arrowPath*/ ctx[3]);
    			attr_dev(path1, "fill", /*stroke*/ ctx[0]);
    			add_location(path1, file$c, 43, 4, 1501);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "shape-rendering", "crispEdges");
    			attr_dev(svg, "class", "arrow svelte-5u2c1l");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "width", "100%");
    			add_location(svg, file$c, 41, 0, 1283);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*path*/ 4) {
    				attr_dev(path0, "d", /*path*/ ctx[2]);
    			}

    			if (dirty & /*stroke*/ 1) {
    				attr_dev(path0, "stroke", /*stroke*/ ctx[0]);
    			}

    			if (dirty & /*strokeWidth*/ 2) {
    				attr_dev(path0, "stroke-width", /*strokeWidth*/ ctx[1]);
    			}

    			if (dirty & /*arrowPath*/ 8) {
    				attr_dev(path1, "d", /*arrowPath*/ ctx[3]);
    			}

    			if (dirty & /*stroke*/ 1) {
    				attr_dev(path1, "fill", /*stroke*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { startY } = $$props;
    	let { endY } = $$props;
    	let { endX } = $$props;
    	let { startX } = $$props;
    	let { minLen = 12 } = $$props;
    	let { arrowSize = 5 } = $$props;
    	let { stroke = "red" } = $$props;
    	let { strokeWidth = 2 } = $$props;

    	onMount(() => {
    		
    	});

    	let height;
    	let width;
    	let path;
    	let arrowPath;

    	const writable_props = [
    		"startY",
    		"endY",
    		"endX",
    		"startX",
    		"minLen",
    		"arrowSize",
    		"stroke",
    		"strokeWidth"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Arrow> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Arrow", $$slots, []);

    	$$self.$set = $$props => {
    		if ("startY" in $$props) $$invalidate(4, startY = $$props.startY);
    		if ("endY" in $$props) $$invalidate(5, endY = $$props.endY);
    		if ("endX" in $$props) $$invalidate(6, endX = $$props.endX);
    		if ("startX" in $$props) $$invalidate(7, startX = $$props.startX);
    		if ("minLen" in $$props) $$invalidate(8, minLen = $$props.minLen);
    		if ("arrowSize" in $$props) $$invalidate(9, arrowSize = $$props.arrowSize);
    		if ("stroke" in $$props) $$invalidate(0, stroke = $$props.stroke);
    		if ("strokeWidth" in $$props) $$invalidate(1, strokeWidth = $$props.strokeWidth);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		startY,
    		endY,
    		endX,
    		startX,
    		minLen,
    		arrowSize,
    		stroke,
    		strokeWidth,
    		height,
    		width,
    		path,
    		arrowPath
    	});

    	$$self.$inject_state = $$props => {
    		if ("startY" in $$props) $$invalidate(4, startY = $$props.startY);
    		if ("endY" in $$props) $$invalidate(5, endY = $$props.endY);
    		if ("endX" in $$props) $$invalidate(6, endX = $$props.endX);
    		if ("startX" in $$props) $$invalidate(7, startX = $$props.startX);
    		if ("minLen" in $$props) $$invalidate(8, minLen = $$props.minLen);
    		if ("arrowSize" in $$props) $$invalidate(9, arrowSize = $$props.arrowSize);
    		if ("stroke" in $$props) $$invalidate(0, stroke = $$props.stroke);
    		if ("strokeWidth" in $$props) $$invalidate(1, strokeWidth = $$props.strokeWidth);
    		if ("height" in $$props) $$invalidate(10, height = $$props.height);
    		if ("width" in $$props) $$invalidate(11, width = $$props.width);
    		if ("path" in $$props) $$invalidate(2, path = $$props.path);
    		if ("arrowPath" in $$props) $$invalidate(3, arrowPath = $$props.arrowPath);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*endY, startY*/ 48) {
    			 $$invalidate(10, height = endY - startY);
    		}

    		if ($$self.$$.dirty & /*endX, startX*/ 192) {
    			 $$invalidate(11, width = endX - startX);
    		}

    		if ($$self.$$.dirty & /*startX, minLen, endX, startY, endY, height, width*/ 3568) {
    			 {
    				if (startX == NaN || startX == undefined) $$invalidate(2, path = "M0 0");
    				let result;

    				if (startX + minLen >= endX && startY != endY) {
    					result = `L ${startX + minLen} ${startY} 
                        L ${startX + minLen} ${startY + height / 2}
                        L ${endX - minLen} ${startY + height / 2}
                        L ${endX - minLen} ${endY} `;
    				} else {
    					result = `L ${startX + width / 2} ${startY} 
                        L ${startX + width / 2} ${endY}`;
    				}

    				// -2 so the line doesn't stick out of the arrowhead
    				$$invalidate(2, path = `M${startX} ${startY}` + result + `L ${endX - 2} ${endY}`);
    			}
    		}

    		if ($$self.$$.dirty & /*endX, arrowSize, endY*/ 608) {
    			 {
    				if (endX == NaN || endX == undefined) $$invalidate(3, arrowPath = "M0 0");
    				$$invalidate(3, arrowPath = `M${endX - arrowSize} ${endY - arrowSize} L${endX} ${endY} L${endX - arrowSize} ${endY + arrowSize} Z`);
    			}
    		}
    	};

    	return [
    		stroke,
    		strokeWidth,
    		path,
    		arrowPath,
    		startY,
    		endY,
    		endX,
    		startX,
    		minLen,
    		arrowSize
    	];
    }

    class Arrow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			startY: 4,
    			endY: 5,
    			endX: 6,
    			startX: 7,
    			minLen: 8,
    			arrowSize: 9,
    			stroke: 0,
    			strokeWidth: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Arrow",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*startY*/ ctx[4] === undefined && !("startY" in props)) {
    			console.warn("<Arrow> was created without expected prop 'startY'");
    		}

    		if (/*endY*/ ctx[5] === undefined && !("endY" in props)) {
    			console.warn("<Arrow> was created without expected prop 'endY'");
    		}

    		if (/*endX*/ ctx[6] === undefined && !("endX" in props)) {
    			console.warn("<Arrow> was created without expected prop 'endX'");
    		}

    		if (/*startX*/ ctx[7] === undefined && !("startX" in props)) {
    			console.warn("<Arrow> was created without expected prop 'startX'");
    		}
    	}

    	get startY() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set startY(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get endY() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set endY(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get endX() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set endX(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get startX() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set startX(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minLen() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minLen(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get arrowSize() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set arrowSize(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeWidth() {
    		throw new Error("<Arrow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<Arrow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$f = ".sg-dependency.svelte-fnf1gz{position:absolute;width:100%;height:100%}";
    styleInject(css_248z$f);

    /* src\modules\dependencies\Dependency.svelte generated by Svelte v3.23.0 */
    const file$d = "src\\modules\\dependencies\\Dependency.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let current;

    	const arrow = new Arrow({
    			props: {
    				startX: /*fromTask*/ ctx[1].left + /*fromTask*/ ctx[1].width,
    				startY: /*fromTask*/ ctx[1].top + /*fromTask*/ ctx[1].height / 2,
    				endX: /*toTask*/ ctx[2].left,
    				endY: /*toTask*/ ctx[2].top + /*toTask*/ ctx[2].height / 2
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(arrow.$$.fragment);
    			attr_dev(div, "class", "sg-dependency svelte-fnf1gz");
    			set_style(div, "left", "0");
    			set_style(div, "top", "0");
    			attr_dev(div, "data-dependency-id", /*id*/ ctx[0]);
    			add_location(div, file$d, 11, 0, 326);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(arrow, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const arrow_changes = {};
    			if (dirty & /*fromTask*/ 2) arrow_changes.startX = /*fromTask*/ ctx[1].left + /*fromTask*/ ctx[1].width;
    			if (dirty & /*fromTask*/ 2) arrow_changes.startY = /*fromTask*/ ctx[1].top + /*fromTask*/ ctx[1].height / 2;
    			if (dirty & /*toTask*/ 4) arrow_changes.endX = /*toTask*/ ctx[2].left;
    			if (dirty & /*toTask*/ 4) arrow_changes.endY = /*toTask*/ ctx[2].top + /*toTask*/ ctx[2].height / 2;
    			arrow.$set(arrow_changes);

    			if (!current || dirty & /*id*/ 1) {
    				attr_dev(div, "data-dependency-id", /*id*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(arrow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(arrow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(arrow);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $taskStore;
    	validate_store(taskStore, "taskStore");
    	component_subscribe($$self, taskStore, $$value => $$invalidate(5, $taskStore = $$value));
    	let { id } = $$props;
    	let { fromId } = $$props;
    	let { toId } = $$props;
    	let fromTask;
    	let toTask;
    	const writable_props = ["id", "fromId", "toId"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dependency> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Dependency", $$slots, []);

    	$$self.$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("fromId" in $$props) $$invalidate(3, fromId = $$props.fromId);
    		if ("toId" in $$props) $$invalidate(4, toId = $$props.toId);
    	};

    	$$self.$capture_state = () => ({
    		Arrow,
    		taskStore,
    		id,
    		fromId,
    		toId,
    		fromTask,
    		toTask,
    		$taskStore
    	});

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("fromId" in $$props) $$invalidate(3, fromId = $$props.fromId);
    		if ("toId" in $$props) $$invalidate(4, toId = $$props.toId);
    		if ("fromTask" in $$props) $$invalidate(1, fromTask = $$props.fromTask);
    		if ("toTask" in $$props) $$invalidate(2, toTask = $$props.toTask);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$taskStore, fromId*/ 40) {
    			 $$invalidate(1, fromTask = $taskStore.entities[fromId]);
    		}

    		if ($$self.$$.dirty & /*$taskStore, toId*/ 48) {
    			 $$invalidate(2, toTask = $taskStore.entities[toId]);
    		}
    	};

    	return [id, fromTask, toTask, fromId, toId];
    }

    class Dependency extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { id: 0, fromId: 3, toId: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dependency",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !("id" in props)) {
    			console.warn("<Dependency> was created without expected prop 'id'");
    		}

    		if (/*fromId*/ ctx[3] === undefined && !("fromId" in props)) {
    			console.warn("<Dependency> was created without expected prop 'fromId'");
    		}

    		if (/*toId*/ ctx[4] === undefined && !("toId" in props)) {
    			console.warn("<Dependency> was created without expected prop 'toId'");
    		}
    	}

    	get id() {
    		throw new Error("<Dependency>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Dependency>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fromId() {
    		throw new Error("<Dependency>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fromId(value) {
    		throw new Error("<Dependency>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get toId() {
    		throw new Error("<Dependency>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set toId(value) {
    		throw new Error("<Dependency>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$g = ".dependency-container.svelte-hatx0f{position:absolute;width:100%;height:100%;pointer-events:none;top:0;float:left;overflow:hidden;z-index:0}";
    styleInject(css_248z$g);

    /* src\modules\dependencies\GanttDependencies.svelte generated by Svelte v3.23.0 */
    const file$e = "src\\modules\\dependencies\\GanttDependencies.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (26:4) {#each visibleDependencies as dependency (dependency.id)}
    function create_each_block$5(key_1, ctx) {
    	let first;
    	let current;
    	const dependency_spread_levels = [/*dependency*/ ctx[6]];
    	let dependency_props = {};

    	for (let i = 0; i < dependency_spread_levels.length; i += 1) {
    		dependency_props = assign(dependency_props, dependency_spread_levels[i]);
    	}

    	const dependency = new Dependency({ props: dependency_props, $$inline: true });

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(dependency.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(dependency, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dependency_changes = (dirty & /*visibleDependencies*/ 1)
    			? get_spread_update(dependency_spread_levels, [get_spread_object(/*dependency*/ ctx[6])])
    			: {};

    			dependency.$set(dependency_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dependency.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dependency.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(dependency, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(26:4) {#each visibleDependencies as dependency (dependency.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*visibleDependencies*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*dependency*/ ctx[6].id;
    	validate_each_keys(ctx, each_value, get_each_context$5, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$5(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "dependency-container svelte-hatx0f");
    			add_location(div, file$e, 24, 0, 896);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*visibleDependencies*/ 1) {
    				const each_value = /*visibleDependencies*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$5, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$5, null, get_each_context$5);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $taskStore;
    	let $visibleHeight;
    	validate_store(taskStore, "taskStore");
    	component_subscribe($$self, taskStore, $$value => $$invalidate(4, $taskStore = $$value));
    	const { visibleHeight } = getContext("dimensions");
    	validate_store(visibleHeight, "visibleHeight");
    	component_subscribe($$self, visibleHeight, value => $$invalidate(5, $visibleHeight = value));
    	let { paddingTop } = $$props;
    	let { dependencies = [] } = $$props;
    	let visibleDependencies = [];
    	const writable_props = ["paddingTop", "dependencies"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GanttDependencies> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("GanttDependencies", $$slots, []);

    	$$self.$set = $$props => {
    		if ("paddingTop" in $$props) $$invalidate(2, paddingTop = $$props.paddingTop);
    		if ("dependencies" in $$props) $$invalidate(3, dependencies = $$props.dependencies);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		Dependency,
    		taskStore,
    		visibleHeight,
    		paddingTop,
    		dependencies,
    		visibleDependencies,
    		$taskStore,
    		$visibleHeight
    	});

    	$$self.$inject_state = $$props => {
    		if ("paddingTop" in $$props) $$invalidate(2, paddingTop = $$props.paddingTop);
    		if ("dependencies" in $$props) $$invalidate(3, dependencies = $$props.dependencies);
    		if ("visibleDependencies" in $$props) $$invalidate(0, visibleDependencies = $$props.visibleDependencies);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*dependencies, $taskStore, paddingTop, $visibleHeight*/ 60) {
    			 {
    				const result = [];

    				for (let i = 0; i < dependencies.length; i++) {
    					const dependency = dependencies[i];
    					const map = $taskStore.entities;
    					const fromTask = map[dependency.fromId];
    					const toTask = map[dependency.toId];

    					if (fromTask && toTask && Math.min(fromTask.top, toTask.top) <= paddingTop + $visibleHeight && Math.max(fromTask.top, toTask.top) >= paddingTop) {
    						result.push(dependency);
    					}
    				}

    				$$invalidate(0, visibleDependencies = result);
    			}
    		}
    	};

    	return [visibleDependencies, visibleHeight, paddingTop, dependencies];
    }

    class GanttDependencies extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { paddingTop: 2, dependencies: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GanttDependencies",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*paddingTop*/ ctx[2] === undefined && !("paddingTop" in props)) {
    			console.warn("<GanttDependencies> was created without expected prop 'paddingTop'");
    		}
    	}

    	get paddingTop() {
    		throw new Error("<GanttDependencies>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paddingTop(value) {
    		throw new Error("<GanttDependencies>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dependencies() {
    		throw new Error("<GanttDependencies>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dependencies(value) {
    		throw new Error("<GanttDependencies>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var SvelteGanttDependencies = GanttDependencies;

    const defaults = {
        enabled: true,
        elementContent: () => {
            const element = document.createElement('div');
            element.innerHTML = 'New Task';
            Object.assign(element.style, {
                position: 'absolute',
                background: '#eee',
                padding: '0.5em 1em',
                fontSize: '12px',
                pointerEvents: 'none',
            });
            return element;
        }
    };
    class SvelteGanttExternal {
        constructor(node, options) {
            this.options = Object.assign({}, defaults, options);
            this.draggable = new Draggable(node, {
                onDrag: this.onDrag.bind(this),
                dragAllowed: () => this.options.enabled,
                resizeAllowed: false,
                onDrop: this.onDrop.bind(this),
                container: document.body,
                getX: (event) => event.pageX,
                getY: (event) => event.pageY,
                getWidth: () => 0
            });
        }
        onDrag({ x, y }) {
            if (!this.element) {
                this.element = this.options.elementContent();
                document.body.appendChild(this.element);
                this.options.dragging = true;
            }
            this.element.style.top = y + 'px';
            this.element.style.left = x + 'px';
        }
        onDrop(event) {
            var _a, _b, _c, _d;
            const gantt = this.options.gantt;
            const targetRow = gantt.dndManager.getTarget('row', event.mouseEvent);
            if (targetRow) {
                const mousePos = getRelativePos(gantt.getRowContainer(), event.mouseEvent);
                const date = gantt.utils.getDateByPosition(mousePos.x);
                (_b = (_a = this.options).onsuccess) === null || _b === void 0 ? void 0 : _b.call(_a, targetRow, date, gantt);
            }
            else {
                (_d = (_c = this.options).onfail) === null || _d === void 0 ? void 0 : _d.call(_c);
            }
            document.body.removeChild(this.element);
            this.options.dragging = false;
            this.element = null;
        }
    }

    // import { SvelteGanttTableComponent } from './modules/table';
    var SvelteGantt = Gantt;

    /* src\components\DateTime.svelte generated by Svelte v3.23.0 */

    const file$7 = "src\\components\\DateTime.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let input0;
    	let t;
    	let input1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element$1("div");
    			input0 = element$1("input");
    			t = space$1();
    			input1 = element$1("input");
    			attr_dev$1(input0, "type", "date");
    			attr_dev$1(input0, "class", "svelte-1m398a1");
    			add_location$1(input0, file$7, 42, 4, 812);
    			attr_dev$1(input1, "type", "time");
    			attr_dev$1(input1, "class", "svelte-1m398a1");
    			add_location$1(input1, file$7, 43, 4, 858);
    			attr_dev$1(div, "class", "date-time svelte-1m398a1");
    			add_location$1(div, file$7, 41, 0, 783);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev$1(target, div, anchor);
    			append_dev$1(div, input0);
    			set_input_value(input0, /*dateStr*/ ctx[0]);
    			append_dev$1(div, t);
    			append_dev$1(div, input1);
    			set_input_value(input1, /*timeStr*/ ctx[1]);

    			if (!mounted) {
    				dispose = [
    					listen_dev$1(input0, "input", /*input0_input_handler*/ ctx[5]),
    					listen_dev$1(input1, "input", /*input1_input_handler*/ ctx[6])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dateStr*/ 1) {
    				set_input_value(input0, /*dateStr*/ ctx[0]);
    			}

    			if (dirty & /*timeStr*/ 2) {
    				set_input_value(input1, /*timeStr*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev$1(div);
    			mounted = false;
    			run_all$1(dispose);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { value } = $$props;
    	let dateStr = "";
    	let timeStr = "";

    	function parseDate(dateObj) {
    		if (dateObj) {
    			const [date, time] = new Date(dateObj).toLocaleString("sv-SE").split(" ");
    			$$invalidate(0, dateStr = date);
    			$$invalidate(1, timeStr = time);
    		}
    	}

    	function emitDate(date, time) {
    		if (date && time) {
    			$$invalidate(2, value = new Date(`${date} ${time}`));
    		} else {
    			$$invalidate(2, value = null);
    		}
    	}

    	const writable_props = ["value"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DateTime> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots$1("DateTime", $$slots, []);

    	function input0_input_handler() {
    		dateStr = this.value;
    		$$invalidate(0, dateStr);
    	}

    	function input1_input_handler() {
    		timeStr = this.value;
    		$$invalidate(1, timeStr);
    	}

    	$$self.$set = $$props => {
    		if ("value" in $$props) $$invalidate(2, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		dateStr,
    		timeStr,
    		parseDate,
    		emitDate
    	});

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(2, value = $$props.value);
    		if ("dateStr" in $$props) $$invalidate(0, dateStr = $$props.dateStr);
    		if ("timeStr" in $$props) $$invalidate(1, timeStr = $$props.timeStr);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 4) {
    			{
    				parseDate(value);
    			}
    		}

    		if ($$self.$$.dirty & /*dateStr, timeStr*/ 3) {
    			{
    				emitDate(dateStr, timeStr);
    			}
    		}
    	};

    	return [
    		dateStr,
    		timeStr,
    		value,
    		parseDate,
    		emitDate,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class DateTime extends SvelteComponentDev$1 {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$7, create_fragment$7, safe_not_equal$1, { value: 2 });

    		dispatch_dev$1("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DateTime",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[2] === undefined && !("value" in props)) {
    			console.warn("<DateTime> was created without expected prop 'value'");
    		}
    	}

    	get value() {
    		throw new Error("<DateTime>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<DateTime>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\GanttOptions.svelte generated by Svelte v3.23.0 */
    const file$6 = "src\\components\\GanttOptions.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (53:0) {#if $toggle}
    function create_if_block$1(ctx) {
    	let div10;
    	let h3;
    	let t1;
    	let div0;
    	let label0;
    	let t3;
    	let select0;
    	let t4;
    	let div1;
    	let label1;
    	let t6;
    	let select1;
    	let t7;
    	let div2;
    	let label2;
    	let t8;
    	let t9_value = /*options*/ ctx[0].rowHeight + "";
    	let t9;
    	let t10;
    	let t11;
    	let input0;
    	let t12;
    	let div3;
    	let label3;
    	let t13;
    	let t14_value = /*options*/ ctx[0].rowPadding + "";
    	let t14;
    	let t15;
    	let t16;
    	let input1;
    	let t17;
    	let div4;
    	let label4;
    	let t19;
    	let input2;
    	let t20;
    	let div5;
    	let label5;
    	let t22;
    	let input3;
    	let t23;
    	let div6;
    	let label6;
    	let t25;
    	let updating_value;
    	let t26;
    	let div7;
    	let label7;
    	let t28;
    	let updating_value_1;
    	let t29;
    	let div8;
    	let label8;
    	let t31;
    	let input4;
    	let t32;
    	let div9;
    	let label9;
    	let t34;
    	let input5;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*offsetOptions*/ ctx[2];
    	validate_each_argument$1(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*offsetOptions*/ ctx[2];
    	validate_each_argument$1(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	function datetime0_value_binding(value) {
    		/*datetime0_value_binding*/ ctx[13].call(null, value);
    	}

    	let datetime0_props = {};

    	if (/*options*/ ctx[0].from !== void 0) {
    		datetime0_props.value = /*options*/ ctx[0].from;
    	}

    	const datetime0 = new DateTime({ props: datetime0_props, $$inline: true });
    	binding_callbacks$1.push(() => bind(datetime0, "value", datetime0_value_binding));

    	function datetime1_value_binding(value) {
    		/*datetime1_value_binding*/ ctx[14].call(null, value);
    	}

    	let datetime1_props = {};

    	if (/*options*/ ctx[0].to !== void 0) {
    		datetime1_props.value = /*options*/ ctx[0].to;
    	}

    	const datetime1 = new DateTime({ props: datetime1_props, $$inline: true });
    	binding_callbacks$1.push(() => bind(datetime1, "value", datetime1_value_binding));

    	const block = {
    		c: function create() {
    			div10 = element$1("div");
    			h3 = element$1("h3");
    			h3.textContent = "Options";
    			t1 = space$1();
    			div0 = element$1("div");
    			label0 = element$1("label");
    			label0.textContent = "columnOffset";
    			t3 = space$1();
    			select0 = element$1("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space$1();
    			div1 = element$1("div");
    			label1 = element$1("label");
    			label1.textContent = "magnetOffset";
    			t6 = space$1();
    			select1 = element$1("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t7 = space$1();
    			div2 = element$1("div");
    			label2 = element$1("label");
    			t8 = text$1("rowHeight (");
    			t9 = text$1(t9_value);
    			t10 = text$1(")");
    			t11 = space$1();
    			input0 = element$1("input");
    			t12 = space$1();
    			div3 = element$1("div");
    			label3 = element$1("label");
    			t13 = text$1("rowPadding (");
    			t14 = text$1(t14_value);
    			t15 = text$1(")");
    			t16 = space$1();
    			input1 = element$1("input");
    			t17 = space$1();
    			div4 = element$1("div");
    			label4 = element$1("label");
    			label4.textContent = "fitWidth";
    			t19 = space$1();
    			input2 = element$1("input");
    			t20 = space$1();
    			div5 = element$1("div");
    			label5 = element$1("label");
    			label5.textContent = "minWidth";
    			t22 = space$1();
    			input3 = element$1("input");
    			t23 = space$1();
    			div6 = element$1("div");
    			label6 = element$1("label");
    			label6.textContent = "from";
    			t25 = space$1();
    			create_component$1(datetime0.$$.fragment);
    			t26 = space$1();
    			div7 = element$1("div");
    			label7 = element$1("label");
    			label7.textContent = "to";
    			t28 = space$1();
    			create_component$1(datetime1.$$.fragment);
    			t29 = space$1();
    			div8 = element$1("div");
    			label8 = element$1("label");
    			label8.textContent = "headers[0].format";
    			t31 = space$1();
    			input4 = element$1("input");
    			t32 = space$1();
    			div9 = element$1("div");
    			label9 = element$1("label");
    			label9.textContent = "headers[1].format";
    			t34 = space$1();
    			input5 = element$1("input");
    			attr_dev$1(h3, "class", "svelte-1fy2hpx");
    			add_location$1(h3, file$6, 54, 4, 979);
    			attr_dev$1(label0, "class", "form-label svelte-1fy2hpx");
    			add_location$1(label0, file$6, 57, 8, 1037);
    			attr_dev$1(select0, "class", "svelte-1fy2hpx");
    			if (/*options*/ ctx[0].columnOffset === void 0) add_render_callback$1(() => /*select0_change_handler*/ ctx[7].call(select0));
    			add_location$1(select0, file$6, 58, 8, 1095);
    			attr_dev$1(div0, "class", "form-group svelte-1fy2hpx");
    			add_location$1(div0, file$6, 56, 4, 1003);
    			attr_dev$1(label1, "class", "form-label svelte-1fy2hpx");
    			add_location$1(label1, file$6, 66, 8, 1334);
    			attr_dev$1(select1, "class", "svelte-1fy2hpx");
    			if (/*options*/ ctx[0].magnetOffset === void 0) add_render_callback$1(() => /*select1_change_handler*/ ctx[8].call(select1));
    			add_location$1(select1, file$6, 67, 8, 1392);
    			attr_dev$1(div1, "class", "form-group svelte-1fy2hpx");
    			add_location$1(div1, file$6, 65, 4, 1300);
    			attr_dev$1(label2, "class", "form-label svelte-1fy2hpx");
    			add_location$1(label2, file$6, 75, 8, 1631);
    			attr_dev$1(input0, "type", "range");
    			attr_dev$1(input0, "min", "20");
    			attr_dev$1(input0, "max", "100");
    			attr_dev$1(input0, "class", "svelte-1fy2hpx");
    			add_location$1(input0, file$6, 76, 8, 1708);
    			attr_dev$1(div2, "class", "form-group svelte-1fy2hpx");
    			add_location$1(div2, file$6, 74, 4, 1597);
    			attr_dev$1(label3, "class", "form-label svelte-1fy2hpx");
    			add_location$1(label3, file$6, 80, 8, 1832);
    			attr_dev$1(input1, "type", "range");
    			attr_dev$1(input1, "min", "0");
    			attr_dev$1(input1, "max", "20");
    			attr_dev$1(input1, "step", "2");
    			attr_dev$1(input1, "class", "svelte-1fy2hpx");
    			add_location$1(input1, file$6, 81, 8, 1911);
    			attr_dev$1(div3, "class", "form-group svelte-1fy2hpx");
    			add_location$1(div3, file$6, 79, 4, 1798);
    			attr_dev$1(label4, "class", "form-label svelte-1fy2hpx");
    			add_location$1(label4, file$6, 85, 8, 2043);
    			attr_dev$1(input2, "type", "checkbox");
    			attr_dev$1(input2, "class", "svelte-1fy2hpx");
    			add_location$1(input2, file$6, 86, 8, 2097);
    			attr_dev$1(div4, "class", "form-group svelte-1fy2hpx");
    			add_location$1(div4, file$6, 84, 4, 2009);
    			attr_dev$1(label5, "class", "form-label svelte-1fy2hpx");
    			add_location$1(label5, file$6, 90, 8, 2204);
    			attr_dev$1(input3, "type", "number");
    			attr_dev$1(input3, "min", "800");
    			attr_dev$1(input3, "class", "svelte-1fy2hpx");
    			add_location$1(input3, file$6, 91, 8, 2258);
    			attr_dev$1(div5, "class", "form-group svelte-1fy2hpx");
    			add_location$1(div5, file$6, 89, 4, 2170);
    			attr_dev$1(label6, "class", "form-label svelte-1fy2hpx");
    			add_location$1(label6, file$6, 95, 8, 2373);
    			attr_dev$1(div6, "class", "form-group svelte-1fy2hpx");
    			add_location$1(div6, file$6, 94, 4, 2339);
    			attr_dev$1(label7, "class", "form-label svelte-1fy2hpx");
    			add_location$1(label7, file$6, 100, 8, 2514);
    			attr_dev$1(div7, "class", "form-group svelte-1fy2hpx");
    			add_location$1(div7, file$6, 99, 4, 2480);
    			attr_dev$1(label8, "class", "form-label svelte-1fy2hpx");
    			add_location$1(label8, file$6, 105, 8, 2651);
    			attr_dev$1(input4, "type", "text");
    			attr_dev$1(input4, "class", "svelte-1fy2hpx");
    			add_location$1(input4, file$6, 106, 8, 2714);
    			attr_dev$1(div8, "class", "form-group svelte-1fy2hpx");
    			add_location$1(div8, file$6, 104, 4, 2617);
    			attr_dev$1(label9, "class", "form-label svelte-1fy2hpx");
    			add_location$1(label9, file$6, 110, 8, 2826);
    			attr_dev$1(input5, "type", "text");
    			attr_dev$1(input5, "class", "svelte-1fy2hpx");
    			add_location$1(input5, file$6, 111, 8, 2889);
    			attr_dev$1(div9, "class", "form-group svelte-1fy2hpx");
    			add_location$1(div9, file$6, 109, 4, 2792);
    			attr_dev$1(div10, "class", "controls svelte-1fy2hpx");
    			add_location$1(div10, file$6, 53, 0, 951);
    		},
    		m: function mount(target, anchor) {
    			insert_dev$1(target, div10, anchor);
    			append_dev$1(div10, h3);
    			append_dev$1(div10, t1);
    			append_dev$1(div10, div0);
    			append_dev$1(div0, label0);
    			append_dev$1(div0, t3);
    			append_dev$1(div0, select0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*options*/ ctx[0].columnOffset);
    			append_dev$1(div10, t4);
    			append_dev$1(div10, div1);
    			append_dev$1(div1, label1);
    			append_dev$1(div1, t6);
    			append_dev$1(div1, select1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*options*/ ctx[0].magnetOffset);
    			append_dev$1(div10, t7);
    			append_dev$1(div10, div2);
    			append_dev$1(div2, label2);
    			append_dev$1(label2, t8);
    			append_dev$1(label2, t9);
    			append_dev$1(label2, t10);
    			append_dev$1(div2, t11);
    			append_dev$1(div2, input0);
    			set_input_value(input0, /*options*/ ctx[0].rowHeight);
    			append_dev$1(div10, t12);
    			append_dev$1(div10, div3);
    			append_dev$1(div3, label3);
    			append_dev$1(label3, t13);
    			append_dev$1(label3, t14);
    			append_dev$1(label3, t15);
    			append_dev$1(div3, t16);
    			append_dev$1(div3, input1);
    			set_input_value(input1, /*options*/ ctx[0].rowPadding);
    			append_dev$1(div10, t17);
    			append_dev$1(div10, div4);
    			append_dev$1(div4, label4);
    			append_dev$1(div4, t19);
    			append_dev$1(div4, input2);
    			input2.checked = /*options*/ ctx[0].fitWidth;
    			append_dev$1(div10, t20);
    			append_dev$1(div10, div5);
    			append_dev$1(div5, label5);
    			append_dev$1(div5, t22);
    			append_dev$1(div5, input3);
    			set_input_value(input3, /*options*/ ctx[0].minWidth);
    			append_dev$1(div10, t23);
    			append_dev$1(div10, div6);
    			append_dev$1(div6, label6);
    			append_dev$1(div6, t25);
    			mount_component$1(datetime0, div6, null);
    			append_dev$1(div10, t26);
    			append_dev$1(div10, div7);
    			append_dev$1(div7, label7);
    			append_dev$1(div7, t28);
    			mount_component$1(datetime1, div7, null);
    			append_dev$1(div10, t29);
    			append_dev$1(div10, div8);
    			append_dev$1(div8, label8);
    			append_dev$1(div8, t31);
    			append_dev$1(div8, input4);
    			set_input_value(input4, /*options*/ ctx[0].headers[0].format);
    			append_dev$1(div10, t32);
    			append_dev$1(div10, div9);
    			append_dev$1(div9, label9);
    			append_dev$1(div9, t34);
    			append_dev$1(div9, input5);
    			set_input_value(input5, /*options*/ ctx[0].headers[1].format);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev$1(select0, "change", /*select0_change_handler*/ ctx[7]),
    					listen_dev$1(select1, "change", /*select1_change_handler*/ ctx[8]),
    					listen_dev$1(input0, "change", /*input0_change_input_handler*/ ctx[9]),
    					listen_dev$1(input0, "input", /*input0_change_input_handler*/ ctx[9]),
    					listen_dev$1(input1, "change", /*input1_change_input_handler*/ ctx[10]),
    					listen_dev$1(input1, "input", /*input1_change_input_handler*/ ctx[10]),
    					listen_dev$1(input2, "change", /*input2_change_handler*/ ctx[11]),
    					listen_dev$1(input3, "input", /*input3_input_handler*/ ctx[12]),
    					listen_dev$1(input4, "input", /*input4_input_handler*/ ctx[15]),
    					listen_dev$1(input5, "input", /*input5_input_handler*/ ctx[16])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*offsetOptions*/ 4) {
    				each_value_1 = /*offsetOptions*/ ctx[2];
    				validate_each_argument$1(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*options, offsetOptions*/ 5) {
    				select_option(select0, /*options*/ ctx[0].columnOffset);
    			}

    			if (dirty & /*offsetOptions*/ 4) {
    				each_value = /*offsetOptions*/ ctx[2];
    				validate_each_argument$1(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*options, offsetOptions*/ 5) {
    				select_option(select1, /*options*/ ctx[0].magnetOffset);
    			}

    			if ((!current || dirty & /*options*/ 1) && t9_value !== (t9_value = /*options*/ ctx[0].rowHeight + "")) set_data_dev$1(t9, t9_value);

    			if (dirty & /*options, offsetOptions*/ 5) {
    				set_input_value(input0, /*options*/ ctx[0].rowHeight);
    			}

    			if ((!current || dirty & /*options*/ 1) && t14_value !== (t14_value = /*options*/ ctx[0].rowPadding + "")) set_data_dev$1(t14, t14_value);

    			if (dirty & /*options, offsetOptions*/ 5) {
    				set_input_value(input1, /*options*/ ctx[0].rowPadding);
    			}

    			if (dirty & /*options, offsetOptions*/ 5) {
    				input2.checked = /*options*/ ctx[0].fitWidth;
    			}

    			if (dirty & /*options, offsetOptions*/ 5 && to_number(input3.value) !== /*options*/ ctx[0].minWidth) {
    				set_input_value(input3, /*options*/ ctx[0].minWidth);
    			}

    			const datetime0_changes = {};

    			if (!updating_value && dirty & /*options*/ 1) {
    				updating_value = true;
    				datetime0_changes.value = /*options*/ ctx[0].from;
    				add_flush_callback(() => updating_value = false);
    			}

    			datetime0.$set(datetime0_changes);
    			const datetime1_changes = {};

    			if (!updating_value_1 && dirty & /*options*/ 1) {
    				updating_value_1 = true;
    				datetime1_changes.value = /*options*/ ctx[0].to;
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			datetime1.$set(datetime1_changes);

    			if (dirty & /*options, offsetOptions*/ 5 && input4.value !== /*options*/ ctx[0].headers[0].format) {
    				set_input_value(input4, /*options*/ ctx[0].headers[0].format);
    			}

    			if (dirty & /*options, offsetOptions*/ 5 && input5.value !== /*options*/ ctx[0].headers[1].format) {
    				set_input_value(input5, /*options*/ ctx[0].headers[1].format);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in$1(datetime0.$$.fragment, local);
    			transition_in$1(datetime1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out$1(datetime0.$$.fragment, local);
    			transition_out$1(datetime1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev$1(div10);
    			destroy_each$1(each_blocks_1, detaching);
    			destroy_each$1(each_blocks, detaching);
    			destroy_component$1(datetime0);
    			destroy_component$1(datetime1);
    			mounted = false;
    			run_all$1(dispose);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(53:0) {#if $toggle}",
    		ctx
    	});

    	return block;
    }

    // (60:12) {#each offsetOptions as offset}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*offset*/ ctx[17] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element$1("option");
    			t = text$1(t_value);
    			option.__value = /*offset*/ ctx[17];
    			option.value = option.__value;
    			add_location$1(option, file$6, 60, 16, 1200);
    		},
    		m: function mount(target, anchor) {
    			insert_dev$1(target, option, anchor);
    			append_dev$1(option, t);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev$1(option);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(60:12) {#each offsetOptions as offset}",
    		ctx
    	});

    	return block;
    }

    // (69:12) {#each offsetOptions as offset}
    function create_each_block(ctx) {
    	let option;
    	let t_value = /*offset*/ ctx[17] + "";
    	let t;

    	const block = {
    		c: function create() {
    			option = element$1("option");
    			t = text$1(t_value);
    			option.__value = /*offset*/ ctx[17];
    			option.value = option.__value;
    			add_location$1(option, file$6, 69, 16, 1497);
    		},
    		m: function mount(target, anchor) {
    			insert_dev$1(target, option, anchor);
    			append_dev$1(option, t);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev$1(option);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(69:12) {#each offsetOptions as offset}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$toggle*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty$1();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev$1(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$toggle*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$toggle*/ 2) {
    						transition_in$1(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in$1(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros$1();

    				transition_out$1(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros$1();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in$1(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out$1(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev$1(if_block_anchor);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $optionsStream;
    	let $toggle;
    	let { options } = $$props;
    	const dispatch = createEventDispatcher$1();
    	const offsetOptions = [5, 10, 15, 30];
    	let { toggle, optionsStream } = getContext$1("options");
    	validate_store$1(toggle, "toggle");
    	component_subscribe$1($$self, toggle, value => $$invalidate(1, $toggle = value));
    	validate_store$1(optionsStream, "optionsStream");
    	component_subscribe$1($$self, optionsStream, value => $$invalidate(5, $optionsStream = value));
    	
    	const writable_props = ["options"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<GanttOptions> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots$1("GanttOptions", $$slots, []);

    	function select0_change_handler() {
    		options.columnOffset = select_value(this);
    		$$invalidate(0, options);
    		$$invalidate(2, offsetOptions);
    	}

    	function select1_change_handler() {
    		options.magnetOffset = select_value(this);
    		$$invalidate(0, options);
    		$$invalidate(2, offsetOptions);
    	}

    	function input0_change_input_handler() {
    		options.rowHeight = to_number(this.value);
    		$$invalidate(0, options);
    		$$invalidate(2, offsetOptions);
    	}

    	function input1_change_input_handler() {
    		options.rowPadding = to_number(this.value);
    		$$invalidate(0, options);
    		$$invalidate(2, offsetOptions);
    	}

    	function input2_change_handler() {
    		options.fitWidth = this.checked;
    		$$invalidate(0, options);
    		$$invalidate(2, offsetOptions);
    	}

    	function input3_input_handler() {
    		options.minWidth = to_number(this.value);
    		$$invalidate(0, options);
    		$$invalidate(2, offsetOptions);
    	}

    	function datetime0_value_binding(value) {
    		options.from = value;
    		$$invalidate(0, options);
    	}

    	function datetime1_value_binding(value) {
    		options.to = value;
    		$$invalidate(0, options);
    	}

    	function input4_input_handler() {
    		options.headers[0].format = this.value;
    		$$invalidate(0, options);
    		$$invalidate(2, offsetOptions);
    	}

    	function input5_input_handler() {
    		options.headers[1].format = this.value;
    		$$invalidate(0, options);
    		$$invalidate(2, offsetOptions);
    	}

    	$$self.$set = $$props => {
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    	};

    	$$self.$capture_state = () => ({
    		getContext: getContext$1,
    		createEventDispatcher: createEventDispatcher$1,
    		DateTime,
    		options,
    		dispatch,
    		offsetOptions,
    		toggle,
    		optionsStream,
    		$optionsStream,
    		$toggle
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("toggle" in $$props) $$invalidate(3, toggle = $$props.toggle);
    		if ("optionsStream" in $$props) $$invalidate(4, optionsStream = $$props.optionsStream);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*options*/ 1) {
    			{
    				dispatch("change", options);
    			}
    		}

    		if ($$self.$$.dirty & /*$optionsStream*/ 32) {
    			{
    				dispatch("change", $optionsStream);
    			}
    		}
    	};

    	return [
    		options,
    		$toggle,
    		offsetOptions,
    		toggle,
    		optionsStream,
    		$optionsStream,
    		dispatch,
    		select0_change_handler,
    		select1_change_handler,
    		input0_change_input_handler,
    		input1_change_input_handler,
    		input2_change_handler,
    		input3_input_handler,
    		datetime0_value_binding,
    		datetime1_value_binding,
    		input4_input_handler,
    		input5_input_handler
    	];
    }

    class GanttOptions extends SvelteComponentDev$1 {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$6, create_fragment$6, safe_not_equal$1, { options: 0 });

    		dispatch_dev$1("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GanttOptions",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[0] === undefined && !("options" in props)) {
    			console.warn("<GanttOptions> was created without expected prop 'options'");
    		}
    	}

    	get options() {
    		throw new Error("<GanttOptions>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<GanttOptions>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\LargeDataset.svelte generated by Svelte v3.23.0 */

    const { Object: Object_1$3 } = globals$1;
    const file$5 = "src\\routes\\LargeDataset.svelte";

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let current;

    	const ganttoptions = new GanttOptions({
    			props: { options: /*options*/ ctx[0] },
    			$$inline: true
    		});

    	ganttoptions.$on("change", /*onChangeOptions*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div1 = element$1("div");
    			div0 = element$1("div");
    			t = space$1();
    			create_component$1(ganttoptions.$$.fragment);
    			attr_dev$1(div0, "id", "example-gantt");
    			attr_dev$1(div0, "class", "svelte-yx9117");
    			add_location$1(div0, file$5, 130, 4, 3569);
    			attr_dev$1(div1, "class", "container svelte-yx9117");
    			add_location$1(div1, file$5, 129, 0, 3540);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev$1(target, div1, anchor);
    			append_dev$1(div1, div0);
    			append_dev$1(div1, t);
    			mount_component$1(ganttoptions, div1, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in$1(ganttoptions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out$1(ganttoptions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev$1(div1);
    			destroy_component$1(ganttoptions);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function shuffle(array) {
    	for (var i = array.length - 1; i > 0; i--) {
    		var j = Math.floor(Math.random() * (i + 1));
    		var temp = array[i];
    		array[i] = array[j];
    		array[j] = temp;
    	}
    }

    function instance$5($$self, $$props, $$invalidate) {
    	const currentStart = time("06:00");
    	const currentEnd = time("18:00");
    	let generation = 0;
    	let rowCount = 100;
    	const colors = ["blue", "green", "orange"];

    	const timeRanges = [
    		{
    			id: 0,
    			from: time("10:00"),
    			to: time("12:00"),
    			classes: null,
    			label: "Lunch"
    		},
    		{
    			id: 1,
    			from: time("15:00"),
    			to: time("17:00"),
    			classes: null,
    			label: "Dinner"
    		}
    	];

    	const data = generate();

    	let options = {
    		dateAdapter: new MomentSvelteGanttDateAdapter(moment),
    		rows: data.rows,
    		tasks: data.tasks,
    		timeRanges,
    		columnOffset: 15,
    		magnetOffset: 15,
    		rowHeight: 52,
    		rowPadding: 6,
    		headers: [{ unit: "day", format: "MMMM Do" }, { unit: "hour", format: "H:mm" }],
    		fitWidth: true,
    		minWidth: 800,
    		from: currentStart,
    		to: currentEnd,
    		tableHeaders: [
    			{
    				title: "Label",
    				property: "label",
    				width: 140,
    				type: "tree"
    			}
    		],
    		tableWidth: 240,
    		ganttTableModules: [SvelteGanttTable]
    	};

    	let gantt;

    	onMount$1(() => {
    		window.gantt = gantt = new SvelteGantt({
    				target: document.getElementById("example-gantt"),
    				props: options
    			});
    	});

    	function generate() {
    		const rows = [];
    		const tasks = [];
    		const ids = [...Array(rowCount).keys()];
    		shuffle(ids);

    		for (let i = 0; i < rowCount; i++) {
    			let rand_bool = Math.random() < 0.2;

    			rows.push({
    				id: i,
    				label: "Row #" + i,
    				age: Math.random() * 80 | 0,
    				enableDragging: true,
    				imageSrc: "Content/joe.jpg",
    				classes: rand_bool ? ["row-disabled"] : undefined,
    				enableDragging: !rand_bool,
    				generation
    			});

    			rand_bool = Math.random() > 0.5;
    			const rand_h = Math.random() * 10 | 0;
    			const rand_d = Math.random() * 5 | 0 + 1;

    			tasks.push({
    				type: "task",
    				id: ids[i],
    				resourceId: i,
    				label: "Task #" + ids[i],
    				from: time(`${7 + rand_h}:00`),
    				to: time(`${7 + rand_h + rand_d}:00`),
    				classes: colors[Math.random() * colors.length | 0],
    				generation
    			});
    		}

    		generation += 1;
    		return { rows, tasks };
    	}

    	function onChangeOptions(event) {
    		const opts = event.detail;
    		Object.assign(options, opts);
    		gantt.$set(options);
    	}

    	const writable_props = [];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LargeDataset> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots$1("LargeDataset", $$slots, []);

    	$$self.$capture_state = () => ({
    		SvelteGantt,
    		SvelteGanttTable,
    		MomentSvelteGanttDateAdapter,
    		onMount: onMount$1,
    		time,
    		moment,
    		GanttOptions,
    		currentStart,
    		currentEnd,
    		generation,
    		rowCount,
    		colors,
    		timeRanges,
    		data,
    		options,
    		gantt,
    		shuffle,
    		generate,
    		onChangeOptions
    	});

    	$$self.$inject_state = $$props => {
    		if ("generation" in $$props) generation = $$props.generation;
    		if ("rowCount" in $$props) rowCount = $$props.rowCount;
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("gantt" in $$props) gantt = $$props.gantt;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [options, onChangeOptions];
    }

    class LargeDataset extends SvelteComponentDev$1 {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$5, create_fragment$5, safe_not_equal$1, {});

    		dispatch_dev$1("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LargeDataset",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\routes\Dependencies.svelte generated by Svelte v3.23.0 */
    const file$4 = "src\\routes\\Dependencies.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element$1("div");
    			div0 = element$1("div");
    			attr_dev$1(div0, "id", "example-gantt");
    			attr_dev$1(div0, "class", "svelte-yx9117");
    			add_location$1(div0, file$4, 152, 4, 3976);
    			attr_dev$1(div1, "class", "container svelte-yx9117");
    			add_location$1(div1, file$4, 151, 0, 3947);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev$1(target, div1, anchor);
    			append_dev$1(div1, div0);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev$1(div1);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const currentStart = time("06:00");
    	const currentEnd = time("18:00");
    	const colors = ["blue", "green", "orange"];

    	const timeRanges = [
    		{
    			id: 0,
    			from: time("10:00"),
    			to: time("12:00"),
    			classes: null,
    			label: "Lunch"
    		},
    		{
    			id: 1,
    			from: time("15:00"),
    			to: time("17:00"),
    			classes: null,
    			label: "Dinner"
    		}
    	];

    	const data = {
    		rows: [
    			{
    				"id": 1,
    				"label": "Preparation and Planning"
    			},
    			{ "id": 2, "label": "Development" },
    			{ "id": 3, "label": "Implementation" },
    			{ "id": 4, "label": "Training" },
    			{ "id": 5, "label": "Roll-out product" }
    		],
    		tasks: [
    			{
    				"id": 1,
    				"resourceId": 1,
    				"label": "Preparation",
    				"from": time("7:00"),
    				"to": time("9:00"),
    				"classes": "orange"
    			},
    			{
    				"id": 2,
    				"resourceId": 1,
    				"label": "Planning",
    				"from": time("9:30"),
    				"to": time("11:00"),
    				"classes": "orange"
    			},
    			{
    				"id": 3,
    				"resourceId": 2,
    				"label": "Development",
    				"from": time("12:00"),
    				"to": time("13:30"),
    				"classes": "orange"
    			},
    			{
    				"id": 4,
    				"resourceId": 3,
    				"label": "Implementation",
    				"from": time("13:45"),
    				"to": time("15:45"),
    				"classes": "orange"
    			},
    			{
    				"id": 5,
    				"resourceId": 5,
    				"label": "Finish",
    				"from": time("17:00"),
    				"to": time("17:45"),
    				"classes": "green"
    			},
    			{
    				"id": 6,
    				"resourceId": 4,
    				"label": "Training",
    				"from": time("7:00"),
    				"to": time("10:00"),
    				"classes": "blue"
    			}
    		],
    		dependencies: [
    			{ id: 1, fromId: 1, toId: 2 },
    			{ id: 2, fromId: 2, toId: 3 },
    			{ id: 3, fromId: 3, toId: 4 },
    			{ id: 4, fromId: 4, toId: 5 },
    			{ id: 5, fromId: 6, toId: 5 }
    		]
    	};

    	let options = {
    		dateAdapter: new MomentSvelteGanttDateAdapter(moment),
    		rows: data.rows,
    		tasks: data.tasks,
    		dependencies: data.dependencies,
    		timeRanges,
    		columnOffset: 15,
    		magnetOffset: 15,
    		rowHeight: 52,
    		rowPadding: 6,
    		headers: [{ unit: "day", format: "MMMM Do" }, { unit: "hour", format: "H:mm" }],
    		fitWidth: true,
    		minWidth: 800,
    		from: currentStart,
    		to: currentEnd,
    		tableHeaders: [
    			{
    				title: "Label",
    				property: "label",
    				width: 140,
    				type: "tree"
    			}
    		],
    		tableWidth: 240,
    		ganttTableModules: [SvelteGanttTable],
    		ganttBodyModules: [SvelteGanttDependencies]
    	};

    	let gantt;

    	onMount$1(() => {
    		window.gantt = gantt = new SvelteGantt({
    				target: document.getElementById("example-gantt"),
    				props: options
    			});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dependencies> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots$1("Dependencies", $$slots, []);

    	$$self.$capture_state = () => ({
    		SvelteGantt,
    		SvelteGanttDependencies,
    		SvelteGanttExternal,
    		SvelteGanttTable,
    		MomentSvelteGanttDateAdapter,
    		onMount: onMount$1,
    		time,
    		moment,
    		currentStart,
    		currentEnd,
    		colors,
    		timeRanges,
    		data,
    		options,
    		gantt
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) options = $$props.options;
    		if ("gantt" in $$props) gantt = $$props.gantt;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data];
    }

    class Dependencies extends SvelteComponentDev$1 {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$4, create_fragment$4, safe_not_equal$1, { data: 0 });

    		dispatch_dev$1("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dependencies",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get data() {
    		return this.$$.ctx[0];
    	}

    	set data(value) {
    		throw new Error("<Dependencies>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\External.svelte generated by Svelte v3.23.0 */

    const { Object: Object_1$2, console: console_1$2 } = globals$1;
    const file$3 = "src\\routes\\External.svelte";

    function create_fragment$3(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t2;
    	let current;

    	const ganttoptions = new GanttOptions({
    			props: { options: /*options*/ ctx[0] },
    			$$inline: true
    		});

    	ganttoptions.$on("change", /*onChangeOptions*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div2 = element$1("div");
    			div0 = element$1("div");
    			t0 = space$1();
    			div1 = element$1("div");
    			div1.textContent = "Drag to gantt";
    			t2 = space$1();
    			create_component$1(ganttoptions.$$.fragment);
    			attr_dev$1(div0, "id", "example-gantt");
    			attr_dev$1(div0, "class", "svelte-1latd7l");
    			add_location$1(div0, file$3, 171, 4, 4979);
    			attr_dev$1(div1, "id", "new-task");
    			attr_dev$1(div1, "class", "svelte-1latd7l");
    			add_location$1(div1, file$3, 172, 4, 5015);
    			attr_dev$1(div2, "class", "container svelte-1latd7l");
    			add_location$1(div2, file$3, 170, 0, 4950);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev$1(target, div2, anchor);
    			append_dev$1(div2, div0);
    			append_dev$1(div2, t0);
    			append_dev$1(div2, div1);
    			append_dev$1(div2, t2);
    			mount_component$1(ganttoptions, div2, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in$1(ganttoptions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out$1(ganttoptions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev$1(div2);
    			destroy_component$1(ganttoptions);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const currentStart = time("06:00");
    	const currentEnd = time("18:00");
    	const colors = ["blue", "green", "orange"];
    	let options2 = getContext$1("options");

    	const data = {
    		rows: [
    			{ id: 1, label: "Accounting" },
    			{ id: 2, label: "Business Development" },
    			{ id: 3, label: "Ida Flewan" },
    			{ id: 4, label: "Lauréna Shrigley" },
    			{ id: 5, label: "Ange Kembry" }
    		],
    		tasks: [
    			{
    				id: 3,
    				resourceId: 1,
    				label: "PET-CT",
    				from: time("13:30"),
    				to: time("15:00"),
    				classes: "orange"
    			},
    			{
    				id: 4,
    				resourceId: 1,
    				label: "Auditing",
    				from: time("9:30"),
    				to: time("11:30"),
    				classes: "orange"
    			},
    			{
    				id: 5,
    				resourceId: 2,
    				label: "Security Clearance",
    				from: time("15:15"),
    				to: time("16:00"),
    				classes: "green"
    			},
    			{
    				id: 6,
    				resourceId: 2,
    				label: "Policy Analysis",
    				from: time("14:00"),
    				to: time("17:00"),
    				classes: "blue"
    			},
    			{
    				id: 7,
    				resourceId: 2,
    				label: "Xbox 360",
    				from: time("13:00"),
    				to: time("14:00"),
    				classes: "blue"
    			},
    			{
    				id: 8,
    				resourceId: 3,
    				label: "GNU/Linux",
    				from: time("14:00"),
    				to: time("15:30"),
    				classes: "blue"
    			},
    			{
    				id: 9,
    				resourceId: 4,
    				label: "Electronic Trading",
    				from: time("15:00"),
    				to: time("17:00"),
    				classes: "green"
    			},
    			{
    				id: 10,
    				resourceId: 5,
    				label: "Alternative Medicine",
    				from: time("14:30"),
    				to: time("15:30"),
    				classes: "orange"
    			}
    		],
    		dependencies: []
    	};

    	let options = {
    		dateAdapter: new MomentSvelteGanttDateAdapter(moment),
    		rows: data.rows,
    		tasks: data.tasks,
    		dependencies: data.dependencies,
    		timeRanges: [],
    		columnOffset: 15,
    		magnetOffset: 15,
    		rowHeight: 52,
    		rowPadding: 6,
    		headers: [{ unit: "day", format: "MMMM Do" }, { unit: "hour", format: "H:mm" }],
    		fitWidth: true,
    		minWidth: 800,
    		from: currentStart,
    		to: currentEnd,
    		tableHeaders: [
    			{
    				title: "Label",
    				property: "label",
    				width: 140,
    				type: "tree"
    			}
    		],
    		tableWidth: 240,
    		ganttTableModules: [SvelteGanttTable],
    		ganttBodyModules: [SvelteGanttDependencies]
    	};

    	let gantt;

    	onMount$1(() => {
    		window.gantt = gantt = new SvelteGantt({
    				target: document.getElementById("example-gantt"),
    				props: options
    			});

    		new SvelteGanttExternal(document.getElementById("new-task"),
    		{
    				gantt,
    				onsuccess: (row, date, gantt) => {
    					console.log(row.model.id, new Date(date).toISOString());
    					const id = 5000 + Math.floor(Math.random() * 1000);

    					gantt.updateTask({
    						id,
    						label: `Task #${id}`,
    						from: date,
    						to: date + 3 * 60 * 60 * 1000,
    						classes: colors[Math.random() * colors.length | 0],
    						resourceId: row.model.id
    					});
    				},
    				elementContent: () => {
    					const element = document.createElement("div");
    					element.innerHTML = "New Task";
    					element.className = "sg-external-indicator";
    					return element;
    				}
    			});
    	});

    	function onChangeOptions(event) {
    		const opts = event.detail;
    		Object.assign(options, opts);
    		gantt.$set(options);
    	}

    	const writable_props = [];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<External> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots$1("External", $$slots, []);

    	$$self.$capture_state = () => ({
    		SvelteGantt,
    		SvelteGanttDependencies,
    		SvelteGanttExternal,
    		SvelteGanttTable,
    		MomentSvelteGanttDateAdapter,
    		onMount: onMount$1,
    		getContext: getContext$1,
    		time,
    		moment,
    		GanttOptions,
    		currentStart,
    		currentEnd,
    		colors,
    		options2,
    		data,
    		options,
    		gantt,
    		onChangeOptions
    	});

    	$$self.$inject_state = $$props => {
    		if ("options2" in $$props) options2 = $$props.options2;
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("gantt" in $$props) gantt = $$props.gantt;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [options, onChangeOptions, data];
    }

    class External extends SvelteComponentDev$1 {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$3, create_fragment$3, safe_not_equal$1, { data: 2 });

    		dispatch_dev$1("SvelteRegisterComponent", {
    			component: this,
    			tagName: "External",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get data() {
    		return this.$$.ctx[2];
    	}

    	set data(value) {
    		throw new Error("<External>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Events.svelte generated by Svelte v3.23.0 */

    const { Object: Object_1$1, console: console_1$1 } = globals$1;
    const file$2 = "src\\routes\\Events.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let current;

    	const ganttoptions = new GanttOptions({
    			props: { options: /*options*/ ctx[0] },
    			$$inline: true
    		});

    	ganttoptions.$on("change", /*onChangeOptions*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div1 = element$1("div");
    			div0 = element$1("div");
    			t = space$1();
    			create_component$1(ganttoptions.$$.fragment);
    			attr_dev$1(div0, "id", "example-gantt-events");
    			attr_dev$1(div0, "class", "svelte-4h7flc");
    			add_location$1(div0, file$2, 170, 4, 5128);
    			attr_dev$1(div1, "class", "container svelte-4h7flc");
    			add_location$1(div1, file$2, 169, 0, 5099);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev$1(target, div1, anchor);
    			append_dev$1(div1, div0);
    			append_dev$1(div1, t);
    			mount_component$1(ganttoptions, div1, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in$1(ganttoptions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out$1(ganttoptions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev$1(div1);
    			destroy_component$1(ganttoptions);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const currentStart = time("06:00");
    	const currentEnd = time("18:00");
    	const colors = ["blue", "green", "orange"];
    	let options2 = getContext$1("options");

    	const data = {
    		rows: [
    			{ id: 1, label: "Accounting" },
    			{ id: 2, label: "Business Development" },
    			{ id: 3, label: "Ida Flewan" },
    			{ id: 4, label: "Lauréna Shrigley" },
    			{ id: 5, label: "Ange Kembry" }
    		],
    		tasks: [
    			{
    				id: 3,
    				resourceId: 1,
    				label: "PET-CT",
    				from: time("13:30"),
    				to: time("15:00"),
    				classes: "orange"
    			},
    			{
    				id: 4,
    				resourceId: 1,
    				label: "Auditing",
    				from: time("9:30"),
    				to: time("11:30"),
    				classes: "orange"
    			},
    			{
    				id: 5,
    				resourceId: 2,
    				label: "Security Clearance",
    				from: time("15:15"),
    				to: time("16:00"),
    				classes: "green"
    			},
    			{
    				id: 6,
    				resourceId: 2,
    				label: "Policy Analysis",
    				from: time("14:00"),
    				to: time("17:00"),
    				classes: "blue"
    			},
    			{
    				id: 7,
    				resourceId: 2,
    				label: "Xbox 360",
    				from: time("13:00"),
    				to: time("14:00"),
    				classes: "blue"
    			},
    			{
    				id: 8,
    				resourceId: 3,
    				label: "GNU/Linux",
    				from: time("14:00"),
    				to: time("15:30"),
    				classes: "blue"
    			},
    			{
    				id: 9,
    				resourceId: 4,
    				label: "Electronic Trading",
    				from: time("15:00"),
    				to: time("17:00"),
    				classes: "green"
    			},
    			{
    				id: 10,
    				resourceId: 5,
    				label: "Alternative Medicine",
    				from: time("14:30"),
    				to: time("15:30"),
    				classes: "orange"
    			}
    		],
    		dependencies: []
    	};

    	let options = {
    		dateAdapter: new MomentSvelteGanttDateAdapter(moment),
    		rows: data.rows,
    		tasks: data.tasks,
    		dependencies: data.dependencies,
    		timeRanges: [],
    		columnOffset: 15,
    		magnetOffset: 15,
    		rowHeight: 52,
    		rowPadding: 6,
    		headers: [{ unit: "day", format: "MMMM Do" }, { unit: "hour", format: "H:mm" }],
    		fitWidth: true,
    		minWidth: 800,
    		from: currentStart,
    		to: currentEnd,
    		tableHeaders: [
    			{
    				title: "Label",
    				property: "label",
    				width: 140,
    				type: "tree"
    			}
    		],
    		tableWidth: 240,
    		ganttTableModules: [SvelteGanttTable],
    		ganttBodyModules: [SvelteGanttDependencies],
    		taskElementHook: (node, task) => {
    			function onHover() {
    				console.log("[task] hover", task);
    			}

    			node.addEventListener("mouseenter", onHover);

    			return {
    				destroy() {
    					console.log("[task] destroy");
    					node.removeEventListener("mouseenter", onHover);
    				}
    			};
    		}
    	}; // taskContent: (task) => `${task.label} ${task.from.format('HH:mm')}`

    	let gantt;

    	onMount$1(() => {
    		window.gantt = gantt = new SvelteGantt({
    				target: document.getElementById("example-gantt-events"),
    				props: options
    			});

    		gantt.api.tasks.on.move(task => console.log("Listener: task move", task));

    		//gantt.api.tasks.on.switchRow((task, row, previousRow) => console.log('Listener: task switched row', task));
    		gantt.api.tasks.on.select(task => console.log("Listener: task selected", task));

    		//gantt.api.tasks.on.moveEnd((task) => console.log('Listener: task move end', task));
    		gantt.api.tasks.on.change(([data]) => console.log("Listener: task change", data));

    		gantt.api.tasks.on.changed(task => console.log("Listener: task changed", task));
    	});

    	function onChangeOptions(event) {
    		const opts = event.detail;
    		Object.assign(options, opts);
    		gantt.$set(options);
    	}

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Events> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots$1("Events", $$slots, []);

    	$$self.$capture_state = () => ({
    		SvelteGantt,
    		SvelteGanttDependencies,
    		SvelteGanttExternal,
    		SvelteGanttTable,
    		MomentSvelteGanttDateAdapter,
    		onMount: onMount$1,
    		getContext: getContext$1,
    		time,
    		moment,
    		GanttOptions,
    		currentStart,
    		currentEnd,
    		colors,
    		options2,
    		data,
    		options,
    		gantt,
    		onChangeOptions
    	});

    	$$self.$inject_state = $$props => {
    		if ("options2" in $$props) options2 = $$props.options2;
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("gantt" in $$props) gantt = $$props.gantt;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [options, onChangeOptions, data];
    }

    class Events extends SvelteComponentDev$1 {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$2, create_fragment$2, safe_not_equal$1, { data: 2 });

    		dispatch_dev$1("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Events",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get data() {
    		return this.$$.ctx[2];
    	}

    	set data(value) {
    		throw new Error("<Events>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\routes\Tree.svelte generated by Svelte v3.23.0 */

    const { Object: Object_1 } = globals$1;
    const file$1 = "src\\routes\\Tree.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let current;

    	const ganttoptions = new GanttOptions({
    			props: { options: /*options*/ ctx[0] },
    			$$inline: true
    		});

    	ganttoptions.$on("change", /*onChangeOptions*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div1 = element$1("div");
    			div0 = element$1("div");
    			t = space$1();
    			create_component$1(ganttoptions.$$.fragment);
    			attr_dev$1(div0, "id", "example-gantt");
    			attr_dev$1(div0, "class", "svelte-yx9117");
    			add_location$1(div0, file$1, 197, 4, 5488);
    			attr_dev$1(div1, "class", "container svelte-yx9117");
    			add_location$1(div1, file$1, 196, 0, 5459);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev$1(target, div1, anchor);
    			append_dev$1(div1, div0);
    			append_dev$1(div1, t);
    			mount_component$1(ganttoptions, div1, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in$1(ganttoptions.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out$1(ganttoptions.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev$1(div1);
    			destroy_component$1(ganttoptions);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	const currentStart = time("06:00");
    	const currentEnd = time("18:00");
    	const colors = ["blue", "green", "orange"];

    	const timeRanges = [
    		{
    			id: 0,
    			from: time("10:00"),
    			to: time("12:00"),
    			classes: null,
    			label: "Lunch"
    		},
    		{
    			id: 1,
    			from: time("15:00"),
    			to: time("17:00"),
    			classes: null,
    			label: "Dinner"
    		}
    	];

    	let options2 = getContext$1("options");

    	const data = {
    		rows: [
    			{
    				id: 10,
    				label: "Accounting",
    				class: "row-group",
    				iconClass: "fas fa-calculator",
    				children: [
    					{ id: 11, label: "Petunia Mulliner" },
    					{ id: 12, label: "Mélina Giacovetti" },
    					{ id: 13, label: "Marlène Lasslett" },
    					{ id: 14, label: "Adda Youell" }
    				]
    			},
    			{
    				id: 20,
    				label: "Business Development",
    				class: "row-group",
    				iconClass: "fas fa-user-tie",
    				children: [
    					{ id: 21, label: "Pietra Fallow" },
    					{ id: 22, label: "Mariellen Torbard" },
    					{ id: 23, label: "Renate Humbee" }
    				]
    			},
    			{ id: 3, label: "Ida Flewan" },
    			{ id: 4, label: "Lauréna Shrigley" },
    			{ id: 5, label: "Ange Kembry" }
    		],
    		tasks: [
    			{
    				"id": 1,
    				"resourceId": 11,
    				"label": "LPCVD",
    				"from": time("9:00"),
    				"to": time("11:00"),
    				"classes": "orange"
    			},
    			{
    				"id": 2,
    				"resourceId": 12,
    				"label": "Entrepreneurship",
    				"from": time("10:00"),
    				"to": time("12:30"),
    				"classes": "orange"
    			},
    			{
    				"id": 3,
    				"resourceId": 13,
    				"label": "PET-CT",
    				"from": time("13:30"),
    				"to": time("15:00"),
    				"classes": "orange"
    			},
    			{
    				"id": 4,
    				"resourceId": 14,
    				"label": "Auditing",
    				"from": time("9:30"),
    				"to": time("11:30"),
    				"classes": "orange"
    			},
    			{
    				"id": 5,
    				"resourceId": 21,
    				"label": "Security Clearance",
    				"from": time("15:15"),
    				"to": time("16:00"),
    				"classes": "green"
    			},
    			{
    				"id": 6,
    				"resourceId": 22,
    				"label": "Policy Analysis",
    				"from": time("14:00"),
    				"to": time("17:00"),
    				"classes": "blue"
    			},
    			{
    				"id": 7,
    				"resourceId": 23,
    				"label": "Xbox 360",
    				"from": time("13:30"),
    				"to": time("14:30"),
    				"classes": "blue"
    			},
    			{
    				"id": 8,
    				"resourceId": 3,
    				"label": "GNU/Linux",
    				"from": time("14:00"),
    				"to": time("15:30"),
    				"classes": "blue"
    			},
    			{
    				"id": 9,
    				"resourceId": 4,
    				"label": "Electronic Trading",
    				"from": time("15:00"),
    				"to": time("17:00"),
    				"classes": "green"
    			},
    			{
    				"id": 10,
    				"resourceId": 5,
    				"label": "Alternative Medicine",
    				"from": time("14:30"),
    				"to": time("15:30"),
    				"classes": "orange"
    			}
    		],
    		dependencies: []
    	};

    	let options = {
    		dateAdapter: new MomentSvelteGanttDateAdapter(moment),
    		rows: data.rows,
    		tasks: data.tasks,
    		dependencies: data.dependencies,
    		timeRanges,
    		columnOffset: 15,
    		magnetOffset: 15,
    		rowHeight: 52,
    		rowPadding: 6,
    		headers: [{ unit: "day", format: "MMMM Do" }, { unit: "hour", format: "H:mm" }],
    		fitWidth: true,
    		minWidth: 800,
    		from: currentStart,
    		to: currentEnd,
    		tableHeaders: [
    			{
    				title: "Label",
    				property: "label",
    				width: 140,
    				type: "tree"
    			}
    		],
    		tableWidth: 240,
    		ganttTableModules: [SvelteGanttTable],
    		ganttBodyModules: [SvelteGanttDependencies]
    	};

    	let gantt;

    	onMount$1(() => {
    		window.gantt = gantt = new SvelteGantt({
    				target: document.getElementById("example-gantt"),
    				props: options
    			});
    	});

    	function onChangeOptions(event) {
    		const opts = event.detail;
    		Object.assign(options, opts);
    		gantt.$set(options);
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tree> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots$1("Tree", $$slots, []);

    	$$self.$capture_state = () => ({
    		SvelteGantt,
    		SvelteGanttDependencies,
    		SvelteGanttExternal,
    		SvelteGanttTable,
    		MomentSvelteGanttDateAdapter,
    		onMount: onMount$1,
    		getContext: getContext$1,
    		time,
    		moment,
    		GanttOptions,
    		currentStart,
    		currentEnd,
    		colors,
    		timeRanges,
    		options2,
    		data,
    		options,
    		gantt,
    		onChangeOptions
    	});

    	$$self.$inject_state = $$props => {
    		if ("options2" in $$props) options2 = $$props.options2;
    		if ("options" in $$props) $$invalidate(0, options = $$props.options);
    		if ("gantt" in $$props) gantt = $$props.gantt;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [options, onChangeOptions, data];
    }

    class Tree extends SvelteComponentDev$1 {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance$1, create_fragment$1, safe_not_equal$1, { data: 2 });

    		dispatch_dev$1("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tree",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get data() {
    		return this.$$.ctx[2];
    	}

    	set data(value) {
    		throw new Error("<Tree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.23.0 */

    const { console: console_1 } = globals$1;
    const file = "src\\App.svelte";

    // (42:4) <Router basepath="/svelte-gantt">
    function create_default_slot(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let current;

    	const route0 = new Route({
    			props: { path: "/", component: LargeDataset },
    			$$inline: true
    		});

    	const route1 = new Route({
    			props: {
    				path: "/dependencies",
    				component: Dependencies
    			},
    			$$inline: true
    		});

    	const route2 = new Route({
    			props: { path: "/tree", component: Tree },
    			$$inline: true
    		});

    	const route3 = new Route({
    			props: { path: "/external", component: External },
    			$$inline: true
    		});

    	const route4 = new Route({
    			props: { path: "/events", component: Events },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component$1(route0.$$.fragment);
    			t0 = space$1();
    			create_component$1(route1.$$.fragment);
    			t1 = space$1();
    			create_component$1(route2.$$.fragment);
    			t2 = space$1();
    			create_component$1(route3.$$.fragment);
    			t3 = space$1();
    			create_component$1(route4.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component$1(route0, target, anchor);
    			insert_dev$1(target, t0, anchor);
    			mount_component$1(route1, target, anchor);
    			insert_dev$1(target, t1, anchor);
    			mount_component$1(route2, target, anchor);
    			insert_dev$1(target, t2, anchor);
    			mount_component$1(route3, target, anchor);
    			insert_dev$1(target, t3, anchor);
    			mount_component$1(route4, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in$1(route0.$$.fragment, local);
    			transition_in$1(route1.$$.fragment, local);
    			transition_in$1(route2.$$.fragment, local);
    			transition_in$1(route3.$$.fragment, local);
    			transition_in$1(route4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out$1(route0.$$.fragment, local);
    			transition_out$1(route1.$$.fragment, local);
    			transition_out$1(route2.$$.fragment, local);
    			transition_out$1(route3.$$.fragment, local);
    			transition_out$1(route4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component$1(route0, detaching);
    			if (detaching) detach_dev$1(t0);
    			destroy_component$1(route1, detaching);
    			if (detaching) detach_dev$1(t1);
    			destroy_component$1(route2, detaching);
    			if (detaching) detach_dev$1(t2);
    			destroy_component$1(route3, detaching);
    			if (detaching) detach_dev$1(t3);
    			destroy_component$1(route4, detaching);
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(42:4) <Router basepath=\\\"/svelte-gantt\\\">",
    		ctx
    	});

    	return block;
    }

    // (50:4) {#if showOptions}
    function create_if_block(ctx) {
    	const block = { c: noop$1, m: noop$1, d: noop$1 };

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(50:4) {#if showOptions}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let t0;
    	let div;
    	let t1;
    	let current;
    	const nav = new Nav({ $$inline: true });
    	nav.$on("updateOptions", /*onChangeOptions*/ ctx[3]);
    	nav.$on("toggleOptions", /*onToggleOptions*/ ctx[1]);
    	nav.$on("loadRoute", /*onLoadRoute*/ ctx[4]);

    	const router = new Router({
    			props: {
    				basepath: "/svelte-gantt",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*showOptions*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			create_component$1(nav.$$.fragment);
    			t0 = space$1();
    			div = element$1("div");
    			create_component$1(router.$$.fragment);
    			t1 = space$1();
    			if (if_block) if_block.c();
    			attr_dev$1(div, "class", "container svelte-17wkc19");
    			add_location$1(div, file, 40, 0, 1231);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component$1(nav, target, anchor);
    			insert_dev$1(target, t0, anchor);
    			insert_dev$1(target, div, anchor);
    			mount_component$1(router, div, null);
    			append_dev$1(div, t1);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);

    			if (/*showOptions*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in$1(nav.$$.fragment, local);
    			transition_in$1(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out$1(nav.$$.fragment, local);
    			transition_out$1(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component$1(nav, detaching);
    			if (detaching) detach_dev$1(t0);
    			if (detaching) detach_dev$1(div);
    			destroy_component$1(router);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev$1("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $optionsStream;
    	let showOptions = false;

    	function onToggleOptions() {
    		$$invalidate(0, showOptions = !showOptions);
    	}

    	let optionsStream = new writable$1({});
    	validate_store$1(optionsStream, "optionsStream");
    	component_subscribe$1($$self, optionsStream, value => $$invalidate(5, $optionsStream = value));

    	function onChangeOptions(event) {
    		const opts = event.detail;
    		set_store_value$1(optionsStream, $optionsStream = opts);
    		optionsStream.set(opts);
    		console.log("onChangeOptions", opts);
    	}

    	setContext$1("options", {
    		optionsStream,
    		toggle: new writable$1(false)
    	});

    	function onLoadRoute(event) {
    		navigate(event.detail.url);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots$1("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		Nav,
    		Router,
    		Route,
    		navigate,
    		Link,
    		LargeDataset,
    		Dependencies,
    		External,
    		Events,
    		Tree,
    		writable: writable$1,
    		setContext: setContext$1,
    		showOptions,
    		onToggleOptions,
    		optionsStream,
    		onChangeOptions,
    		onLoadRoute,
    		$optionsStream
    	});

    	$$self.$inject_state = $$props => {
    		if ("showOptions" in $$props) $$invalidate(0, showOptions = $$props.showOptions);
    		if ("optionsStream" in $$props) $$invalidate(2, optionsStream = $$props.optionsStream);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showOptions, onToggleOptions, optionsStream, onChangeOptions, onLoadRoute];
    }

    class App extends SvelteComponentDev$1 {
    	constructor(options) {
    		super(options);
    		init$1(this, options, instance, create_fragment, safe_not_equal$1, {});

    		dispatch_dev$1("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.getElementById("app")
    });

    return app;

})();
//# sourceMappingURL=index.js.map