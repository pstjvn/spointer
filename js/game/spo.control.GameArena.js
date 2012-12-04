goog.provide('spo.control.GameArena');

goog.require('spo.control.Base');
goog.require('pstj.ui.CustomScrollArea');
goog.require('spo.control.MailBoxList');
goog.require('spo.control.Action');
goog.require('spo.control.Event');
goog.require('spo.control.EventType');
goog.require('spo.ds.mail');
goog.require('spo.ui.MailList');
goog.require('spo.control.MailPreview');
goog.require('spo.control.Composer');
goog.require('spo.ui.GameHeader');

/**
 * The mail control of the game area.
 *
 * @constructor
 * @extends {spo.control.Base}
 * @param {!Element} container The container to render the views in.
 */
spo.control.GameArena = function(container) {
  goog.base(this, container);
  this.init();
};
goog.inherits(spo.control.GameArena, spo.control.Base);

/**
 * Initialize the controller.
 * @protected
 */
spo.control.GameArena.prototype.init = function() {
  // Create the view
  this.view_ = new pstj.ui.CustomScrollArea();
  this.view_.setScrollInsideTheWidget(false);
  this.view_.render(this.container_);
  this.view_.getContentElement().innerHTML = spo.gametemplate.Widgets({});
  // TODO: Load game details => setup header

  var top_pane = /** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName(
  'mail-list-placeholder'), this.view_.getContentElement()));

  //Load mailbox list => setup mailbox list
  this.mailbox_ = new spo.control.MailBoxList(top_pane);
  this.mailbox_.setParentControl(this);

  // Load mail listing UI.
  this.maillist_ = new spo.ui.MailList();
  this.getHandler().listen(this.maillist_, spo.control.EventType.CONTROL_ACTION,
    this.handleMailListAction);
  this.maillist_.render(top_pane);


  this.previewControl_ = new spo.control.MailPreview(
    /** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName(
      'mail-preview-container'), this.view_.getContentElement())));

  this.composer = new spo.control.Composer(/** @type {!Element} */(goog.dom.getElementByClass(goog.getCssName(
  'mail-editor-container'), this.view_.getContentElement())));
  this.composer.setEnable(true);

  spo.ui.GameHeader.getInstance().setSearchFiledState('search messages', goog.bind(this.performSearch, this));

};

spo.control.GameArena.prototype.performSearch = function(text) {
  console.log('text to search', text);
};

spo.control.GameArena.prototype.currentPreviewdMailRecord_ = null;

/**
 * Loads a mail using data from the mail listing.
 */
spo.control.GameArena.prototype.loadMailPreview = function() {
  var record = this.maillist_.getSelectedRecord();
  if (record != null) {
    this.currentPreviewdMailRecord_ = record;
    this.previewControl_.loadRecord(this.currentPreviewdMailRecord_);
  }
};

/**
 * Handles the control actions coming from the mail listing.
 * @param {spo.control.Event} ev The control event.
 * @protected
 */
spo.control.GameArena.prototype.handleMailListAction = function(ev) {
  ev.stopPropagation();
  switch (ev.getAction()) {
  case spo.control.Action.SELECT:
    this.loadMailPreview();
    break;
  }
};
/** @inheritDoc */
spo.control.GameArena.prototype.notify = function(child, action) {
  switch (child) {
    case this.mailbox_:
      if (action == spo.control.Action.SELECT) {
        console.log(' Received new resource', this.mailbox_.getActiveResource());
        var mailbox = spo.ds.mail.getListing(this.mailbox_.getActiveResource());
        console.log(mailbox);
        this.maillist_.setModel(spo.ds.mail.getListing(this.mailbox_.getActiveResource()));

      }
      break;
    default:
       goog.base(this, 'notify', null, action);
       break;
  }
};