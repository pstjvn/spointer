goog.provide('spo.control.Base');

goog.require('goog.Disposable');
goog.require('goog.events.EventHandler');

/**
 * A base controler class to inherit from. It contains some uilities.
 * @constructor
 * @extends {goog.Disposable}
 * @param {!Element} container The HTMl element to use as container.
 */
spo.control.Base = function(container) {
  goog.base(this);
  this.container_ = container;
};
goog.inherits(spo.control.Base, goog.Disposable);

/**
 * The event handler for this instance.
 * @type {goog.events.EventHandler}
 * @private
 */
spo.control.Base.prototype.eh_;

/**
 * Flag - true if the control has been initialized already.
 * @type {boolean}
 * @private
 */
spo.control.Base.prototype.inited_ = false;


/**
 * Method to set the controler state.
 * Implementors should override this class.
 * @param {boolean} enable The state to put the controler in, true if it should
 * be enabled, false otherwise.
 * @param {Function=} fn Function to execute after the disable finished.
 */
spo.control.Base.prototype.setEnabled = goog.abstractMethod;

/**
 * Imitate the getHandler method from Component to allow lazy init
 * of a handler.
 * @protected
 * @return {!goog.events.EventHandler} The bound EventHandler.
 */
spo.control.Base.prototype.getHandler = function() {
  if (!this.eh_) {
    this.eh_ = new goog.events.EventHandler(this);
  }
  return this.eh_;
};

/**
 * @inheritDoc
 */
spo.control.Base.prototype.disposeInternal = function() {
  if (this.eh_) this.eh_.dispose();
  delete this.eh_;
  delete this.inited_;
  goog.base(this, 'disposeInternal');
};
